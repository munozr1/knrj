import * as React from "react";
import { app } from './AuthProvider';
import { getFirestore, collection, onSnapshot, query, where, getDocs, doc, addDoc, deleteDoc, updateDoc, increment, decrement } from "firebase/firestore";


const db = getFirestore(app);
const DBContext = React.createContext();

const FirestoreProvider = ({ children }) => {


  /*
  const songAddData = (songName, songArtist) => {
  artist:songArtist
  songname:songName
}


const songDeleteData = (songName, songArtist) => {
  artist:songArtist
  songname:songName
}


const enqueue = async (songAddData, code) =>{
  const eventEnqDoc=doc(db,'event', where('event_code', '==', code));
  await updateDoc(eventEnqDoc, {
    songs: arrayUnion(songAddData)
  });
}


const dequeue = async (songDeleteData,code) => {
  const eventDeqDoc=doc(db,'event', where('event_code', '==', code));
  await updateDoc(eventDeqDoc, {
      songs: arrayRemove(songDeleteData)
    });
}

      DB FUNCTIONS FOR PLAYER


  */

  // Updates the current playing song
  const updateCurrentPlayingSong = async (code, song) => {
    const eventRef = doc(db, 'event', where('event_code', '==', code));

    await updateDoc(eventRef, {
      current_song: song
    });
  }

  // Increment skip count by one
  const addSkipCount = async (code) => {
    const eventRef = doc(db, 'event', where('event_code', '==', code));

    await updateDoc(eventRef, {
      skip_count: increment(1)
    });
  }

  // Resets skip count to zero
  const resetSkipCount = async (code) => {
    const eventRef = doc(db, 'event', where('event_code', '==', code));

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
    let count = 0;

    const q = query(collection(db, 'event'), where('event_code', '==', code));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      count++;
      console.log(doc.id, " => ", doc.data());
    })

    console.log('count: ', count);
    return (count > 0) ? true : false;
  }

  // Generates a random 4 digit code
  const generateCode = () => {
    var min = 1000;
    var max = 9999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);

    console.log('Event Code - ' + code);
    return code;
  }

  /*
   *  Updated to Web version 9
   */
  // Creates event in database
  const createEvent = async (phonenumber) => {
    let code = generateCode();

    /*
    if (!findEvent(code)) {
      while (!findEvent(code)) {
        code = generateCode();
      }
    }
    */

    const docRef = await addDoc(collection(db, 'event'), {
      event_code: code,
      host: phonenumber,
      user_count: 1,
      skip_count: 0,
      current_song: 'null',
    });
    console.log("Document written with ID: ", docRef.id);

    const data = {
      eventcode: event_code,
      host: phonenumber
    }
    
    const res = collection(db, 'event').doc(event_code).set(data);
  }

  /*
   *  Updated to Web version 9
   */
  // Leaves a event
  const leaveEvent = async (host, code) => {
    const eventDoc = doc(db, 'event', where('event_code', '==', code));

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
        addSkipCount,
        resetSkipCount,
        findEvent,
        createEvent,
        joinEvent,
        leaveEvent
      }}>
      {children}
    </DBContext.Provider>
  );
};

export { DBContext, FirestoreProvider };
