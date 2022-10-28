import React from "react";
import { app } from "./AuthProvider";
import { getFirestore } from 'firebase/firestore'
import {collection, addDoc,  doc, getDoc, query, where, getDocs } from "firebase/firestore";


const db = getFirestore(app)

const DBContext = React.createContext();

const FirestoreProvider = ({ children }) => {

  //check if an event exists given a code
  const findEvent = async (code) => {
    let count = 0;
    const q = query(collection(db, "event"), where("eventcode", "==", code));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      count++;
      console.log(doc.id, " => ", doc.data());
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

  const createEvent = async (phonenumber) =>{
    let event_code = generateCode();
    let question = React.useState(findEvent(event_code));

    if (question) {
      while (question) {
        event_code = generateCode();
        question = React.useState(findEvent(event_code));
      }
    }

    const data = {
      eventcode: event_code,
      host: phonenumber
    }
    
    const res = collection(db, 'event').doc(event_code).set(data);
  }

  const joinEvent = async (phonenumber, event_code) => {
    if (!findEvent(event_code)) {
      const eventRef = db.collection('event').doc(event_code);

      const res = await eventRef.set({
        members: {
          phonenumber
        }
      }, { merge: true });
    }
  }

  return (
    // the Provider gives access to the context to its children
    <DBContext.Provider
      value={{
      findEvent,
      createEvent
      }}>
      {children}
    </DBContext.Provider>
  );
};

export { DBContext, FirestoreProvider };
