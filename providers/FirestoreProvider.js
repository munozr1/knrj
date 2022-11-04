import * as React from "react";
import { app } from './AuthProvider';
import { getFirestore, collection, query, where, getDocs, doc, addDoc } from "firebase/firestore";


const db = getFirestore(app);
const DBContext = React.createContext();

const FirestoreProvider = ({ children }) => {

  /*


      DB FUNCTIONS FOR EVENTS


  */

  //check if an event exists given a code
  const findEvent = async (code) => {
    let count = 0;

    const q = query(collection(db, 'event'), where('eventcode', '==', code));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    })

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

    const docRef = await addDoc(collection(db, 'event'), {
      eventcode: code,
      host: phonenumber,
      user_count: 1,
      skip_count: 0,
      current_song: 'null',
    });
    console.log("Document written with ID: ", docRef.id);
    return(
      code
    );
  }

  const joinEvent = async (code) => {
    const snapshot = await collection(db, 'event').where('eventcode', '==', code).get();
      
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
      const res = await collection(db, 'event').where('eventcode', '==', code).delete();

      console.log('Delete: ', res);
    } else {
      const unsub = db.collection(db, 'event').onSnapshot(() => {
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
