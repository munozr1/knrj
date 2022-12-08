import * as React from "react";
import { app } from './AuthProvider';
import { getFirestore, collection, onSnapshot, query, where, getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";

const db = getFirestore(app);
const DBContext = React.createContext();

const FirestoreProvider = ({ children }) => {

  const max_value = 5;
  const [code, setCode] = React.useState(0);
  const [docId, setDocId] = React.useState(null);
  const [firestoreEvent, setFirestoreEvent] = React.useState({});

  const enqueue = async (song_id) => {
    const eventDeqDoc = doc(db, 'event', docId);

    await updateDoc(eventDeqDoc, {
      queue: arrayUnion(song_id)
    }).catch(err =>{
      console.log("Firestore Provider => enqueue() => updateDoc()", err)
    });

  }


  const queue = async () => {
    if(docId == null){
      console.log("Firesotre Provider => queue() => docId is null");
      return;
    }
    const docRef = doc(db, "event", docId);
    const docSnap = await getDoc(docRef).catch(err =>{
      console.log("Firestore Provider => queue() => getDoc()", err)
    });


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
    }).catch(err =>{
      console.log("Firestore Provider => dequeu()", err)
    });
  }

  /*

    DB FUNCTIONS FOR PLAYER

  */
  const getCurrentSkipCount = async () => {
    const docRef = doc(db, 'event', docId);
    const docSnap = await getDoc(docRef).catch(err => {
      console.log("Firestore Provider => getCurrentSkipCount() => getDoc(): ", err)
    });

    // return docSnap.get('skip_count');
    if (docSnap.exists()) {
      return docSnap.data().skip_count;
    } else {
      return 0;
    }
  }

  // Updates the current playing song
  const updateCurrentPlayingSong = async (song_id) => {
    if(!song_id)
      return;
    try{
      const eventRef = doc(db, 'event', docId);
      await updateDoc(eventRef, {
        current_song: song_id
      });
    }catch(err){
      console.log("Firestore Provider => updateCurrentPlayingSong(): ", err)
      throw err;
    }
  }


  const updateEventToken = async (token) => {
    if(!token || token === null){
      console.log("Firestore Provider => updateEventToken(): token is null");
      return;
    }
    try{
      const eventRef = doc(db, 'event', docId);
      await updateDoc(eventRef, {
        spotify_token: token
      });
    }catch(err){
      console.log("Firestore Provider => updateEventToken(): ", err)
      throw err;
    }
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

  const findEventByCode = async ( code) => {
    try {
      //query for event with host number
      let docSnap;
      const q = query(collection(db, 'event'), where('event_code', '==',Number(code) ));
      // const querySnapshot = 
      await getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          console.log('findEventByCode () => getDocs() => docId: ', querySnapshot.docs[0].id);
          docSnap = querySnapshot.docs[0].data();
          // setDocId(querySnapshot.docs[0].id);
        }
        // console.log('alreadyHosting() => getDocs(): ', docSnap);
      });

      if (!docSnap)
        return null;
      return docSnap;
    } catch (err) {
      console.log('Firestore Provider => findEventByCode() => Error: ', err);
      throw err;
    }
}



  /*
   *  Updated to Web version 9
   */
  // Find an event given a code
  const findEvent = async (code) => {
      const id = findEventByCode('event', code);
      setDocId(id);
  }

  // Generates a random 4 digit code
  const generateCode = () => {
    var min = 1000;
    var max = 9999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);

    // console.log('Event Code Generated: ' + code);
    return code;
  }

  const alreadyHosting = async (number) => {
    // console.log('alreadyHosting before try: ', number);
    try{
      //query for event with host number
      let docSnap;
      const q = query(collection(db, 'event'), where('host', '==', number));
      // const querySnapshot = 
      await getDocs(q).then((querySnapshot) => {
        // console.log('alreadyHosting() => getDocs() => docId: ', querySnapshot.docs[0].id);
        if(!querySnapshot.empty){
          docSnap = querySnapshot.docs[0].data();
          setDocId(querySnapshot.docs[0].id);
        }
        // console.log('alreadyHosting() => getDocs(): ', docSnap);
      });

      if(!docSnap)
        return null;
      return docSnap;
    }catch(err){
      console.log('Firestore Provider => alreadyHosting() => Error: ', err);
      throw err;
    }
  }

  /*
   *  Updated to Web version 9
   */
  // Creates event in database
  const createEvent = async (phonenumber, token, track) => {
    // generate a event code that does not yet exist
    let event = {};
    try {
      const hosting = await alreadyHosting(phonenumber)
      if (hosting) {
        console.log('createEvent() => already hostingg', hosting.event_code, docId);
        setCode(hosting.event_code);
        const eventRef = doc(db, 'event', docId);
        if(eventRef)
          subscribeToEvent(eventRef);
        else
          console.log('createEvent() => already hosting => eventRef is null');
        return hosting
      }
    } catch (error) {
      console.log('Firestore Provider => createEvent() => alreadyHosting() => Error: ', error);
      throw error;

    }
    
    try{

      const number = generateCode();
      //set code state for app to use
      setCode(number);

      //create new record in event collection in firebase
      await addDoc(collection(db, 'event'), {
        event_code: number,
        host: phonenumber,
        user_count: 1,
        skip_count: 0,
        current_song: track,
        queue: [],
        spotify_token: token
      }).then(data=>{
        event = data;
        console.log('createEvent() => addDoc(): ', data.id);
        setDocId(data.id);
      }).catch(err => {
        console.log("Firestore Provider => createEvent() docRef() => Error adding document: ", err);
        throw err;
      });
      console.log('event created: ', event);
      const eventRef = doc(db, 'event', docId);
      subscribeToEvent(eventRef);
    } catch (error) {
      console.log("Firestore Provider => createEvent() => Error adding document: ", error);
      throw error;
    }
      
      return JSON.parse(JSON.stringify(event));
  }

  /*
   *  Updated to Web version 9
   */
  // Joins a event 
  const joinEvent = async (code) => {
    console.log("Joining event: ", code, typeof(code));
    const q = query(collection(db, 'event'), where('event_code', '==', Number(code)));

    await getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        setDocId(querySnapshot.docs[0].id);
        console.log('joinEvent() => getDocs() => docId: ', querySnapshot.docs[0].id);
      }
    });

    console.log('docId: ', docId);
    const docRef = await doc(db, 'event', docId);
    await incrementField('user_count', docRef).catch(err => {
        console.log("Firestore Provider => joinEvent(): ", err)
        throw err;
      });

      setTimeout(() => {
        subscribeToEvent(docRef);
      }, 2000);
  }


  const subscribeToEvent = async (ref) => {
    const unsub = onSnapshot(ref, (doc) => {
      console.log("Current data: ", doc.data());
      if(doc.data()){
        setFirestoreEvent(doc.data());
        setCode(doc.data().event_code);
      }
    });
  }

  

  const incrementField = async (field, ref) => {
    // Get a reference to the Firestore document
    // const docRef = firebase.firestore().collection(collection).doc(docId);
    const d = (await getDoc(ref)).data();
    await updateDoc(ref, {
      [field]: d[field]+1
    })
  }
  const decrementField = async (field, ref) => {
    // Get a reference to the Firestore document
    // const docRef = firebase.firestore().collection(collection).doc(docId);
    const d = (await getDoc(ref)).data();
    await updateDoc(ref, {
      [field]: d[field]- 1
    })
  }

  /*
   *  Updated to Web version 9
   */
  // Leaves a event
  const leaveEvent = async (hosting) => {
    console.log('hosting: ', hosting);
    try {
      console.log('leaving event: ', code);
      console.log('leaving docId: ', docId);
      const docRef = doc(db, 'event', docId);
      await decrementField('user_count', docRef);
      // if(!hosting)
      //   await deleteDoc(docRef);
    } catch (error) {
      console.log("Firestore Provider => leaveEvent() => Error: ", error);
      throw error;
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
        findEventByCode,
        createEvent,
        joinEvent,
        leaveEvent,
        enqueue,
        queue,
        dequeue,
        updateEventToken,
        firestoreEvent
      }}>
      {children}
    </DBContext.Provider>
  );};

export { DBContext, FirestoreProvider };
