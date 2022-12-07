import * as React from "react";
import { app } from './AuthProvider';
import { getFirestore, collection, onSnapshot, query, where, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc, increment, decrement, arrayUnion, arrayRemove } from "firebase/firestore";

const db = getFirestore(app);
const DBContext = React.createContext();

const FirestoreProvider = ({ children }) => {

  const max_value = 5;
  const [code, setCode] = React.useState(0);
  const [docId, setDocId] = React.useState(null);

  const enqueue = async (song_id) => {
    const eventDeqDoc = doc(db, 'event', docId);

    await updateDoc(eventDeqDoc, {
      queue: arrayUnion(song_id)
    });
  }

  const queue = async () => {
    const docRef = doc(db, "event", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Song data:", docSnap.get('queue'));
      return docSnap.get('queue');
    }
    else {
      console.log("No such event exist!");
    }
  }


  const dequeue = async (song_id) => {
    const eventDeqDoc = doc(db, 'event', docId);

    await updateDoc(eventDeqDoc, {
      queue: arrayRemove(song_id)
    });
  }

  /*

    DB FUNCTIONS FOR PLAYER

  */
  const getCurrentSkipCount = async () => {
    const docRef = doc(db, 'event', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.get('skip_count');
    } else {
      return 0;
    }
  }

  // Updates the current playing song
  const updateCurrentPlayingSong = async (song_id) => {
    const eventRef = doc(db, 'event', docId);

    await updateDoc(eventRef, {
      current_song: song_id
    });
  }

  // Increment skip count by one
  const addSkipCount = async () => {
    const eventRef = doc(db, 'event', docId);

    await updateDoc(eventRef, {
      skip_count: increment(1)
    });

    const skip_value = getCurrentSkipCount();
    if (skip_value >= max_value) {
      resetSkipCount();
    }
  }

  // Resets skip count to zero
  const resetSkipCount = async () => {
    const eventRef = doc(db, 'event', docId);

    await updateDoc(eventRef, {
      skip_count: 0
    });
  }


  /*


      DB FUNCTIONS FOR EVENTS


  */

  /*
   *  Updated to Web version 9
   */
  // Find an event given a code
  const findEvent = async (code) => {
    const query = query(collection(db, 'event'), where('event_code', '==', code));
    const querySnapshot = await getDocs(query);

    return querySnapshot.size > 0;
  }

  // Generates a random 4 digit code
  const generateCode = () => {
    var min = 1000;
    var max = 9999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);

    console.log('Event Code Generated: ' + code);
    return code;
  }

  /*
   *  Updated to Web version 9
   */
  // Creates event in database
  const createEvent = async (phonenumber) => {
    const number = generateCode();

    if (findEvent(number)) {
      while (findEvent(number)) number = generateCode();
    }
    setCode(number);

    const docRef = await addDoc(collection(db, 'event'), {
      event_code: number,
      host: phonenumber,
      user_count: 1,
      skip_count: 0,
      current_song: 'null',
      queue: []
    });
    console.log("Document written with ID: ", docRef.id);
    setDocId(docRef.id);
  }

  /*
   *  Updated to Web version 9
   */
  // Joins a event 
  const joinEvent = async (code) => {
    const eventDoc = doc(db, 'event', where('event_code', '==', code));

    const sub = onSnapshot(eventDoc, (doc) => {
      console.log('Current data: ', doc.data());
    });

    await updateDoc(eventDoc, {
      user_count: increment(1)
    });
  }

  /*
   *  Updated to Web version 9
   */
  // Leaves a event
  const leaveEvent = async (host) => {
    const eventDoc = doc(db, 'event', docId);

    if (host) {
      await deleteDoc(eventDoc);
    } else {
      const unsubscribe = onSnapshot(collection(db, 'event'), () => {
        // Respond to data
      });
      unsubscribe();

      await updateDoc(eventDoc, {
        user_count: decrement(1)
      });
    }
  }

  return (
    // the Provider gives access to the context to its children
    <DBContext.Provider
      value={{
        code,
        setCode,
        updateCurrentPlayingSong,
        addSkipCount,
        resetSkipCount,
        findEvent,
        createEvent,
        joinEvent,
        leaveEvent,
        enqueue,
        queue,
        dequeue
      }}>
      {children}
    </DBContext.Provider>
  );
};

export { DBContext, FirestoreProvider };
