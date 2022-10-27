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

  const createEvent = async () =>{
    //TODO add event to events collection

  }

  const joinEvent = async () => {
    //TODO add current user to event members list
  }

  return (
    // the Provider gives access to the context to its children
    <DBContext.Provider
      value={{
      findEvent 
      }}>
      {children}
    </DBContext.Provider>
  );
};

export { DBContext, FirestoreProvider };
