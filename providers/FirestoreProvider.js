import React from "react";
import { app } from "./AuthProvider";
import { getFirestore, FieldValue } from 'firebase-admin/lib/firestore'
import { collection, addDoc,  doc, getDoc, query, where, getDocs } from "firebase/firestore";


const db = getFirestore(app);

const DBContext = React.createContext();

const FirestoreProvider = ({ children }) => {

  /*


      DB FUNCTIONS FOR EVENTS


  */

  //check if an event exists given a code
  const findEvent = async (code) => {
    let count = 0;
    //const q = query(collection(db, 'event'), where('eventcode', '==', code));
    const q = db.collection('event');
    const querySnapshot = await q.get();
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      count++;
      console.log(doc.id, '=>', doc.data());
    });
    console.log('count: ', count);

    return (count > 0) ? true : false;
  }

  // Generate random 4 digit code
  const generateCode = () => {
    var min = 1000;
    var max = 9999;
    var code = Math.floor(Math.random() * (max - min + 1) + min);

    console.log('Event Code - ' + code);
    return code;
  }

  const createEvent = async (phonenumber) => {
    let code = generateCode();

    /*
    if (!findEvent(code)) {
      while (!findEvent(code)) {
        code = generateCode();
      }
    }
    */

    // Add a new document with a generated id.
    const res = await collection('event').add({
      eventcode: code,
      host: phonenumber,
      user_count: 1,
      skip_count: 0,
      current_song: 'null',
      timestamp: FieldValue.serverTimestamp()
    });
    console.log('Added document with ID: ', res.id);
    return(
      code
    );
  }

  const joinEvent = async (code) => {
    const snapshot = await collection('event').where('eventcode', '==', code).get();
      
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  }

  const leaveEvent = async (host, code) => {
    if (host) {
      const res = await collection('event').where('eventcode', '==', code).delete();

      console.log('Delete: ', res);
    } else {
      const unsub = db.collection('event').onSnapshot(() => {
      });
      unsub();
    }
  }

  return (
    // the Provider gives access to the context to its children
    <DBContext.Provider
      value={{
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
