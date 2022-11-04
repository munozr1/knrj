import * as React from "react";
import { app } from './AuthProvider';
import { getFirestore, collection, onSnapshot, query, where, getDocs, doc, addDoc, deleteDoc } from "firebase/firestore";


const db = getFirestore(app);
const DBContext = React.createContext();

const FirestoreProvider = ({ children }) => {

  /*


      DB FUNCTIONS FOR EVENTS


  */

  /*
   *  Updated to Web version 9
   */
  const findEvent = async (code) => {
    let count = 0;

    const q = query(collection(db, 'event'), where('eventcode', '==', code));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      count++;
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

  /*
   *  Updated to Web version 9
   */
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
    return(
      code
    );
  }

  /*
   *  Updated to Web version 9
   */
  const joinEvent = async (code) => {
    const sub = onSnapshot(doc(db, 'event'), where('event_code', '==', code), (doc) => {
      console.log('Current data: ', doc.data());
    });

    // Might not need this part
    sub();
  }

  /*
   *  Updated to Web version 9
   */
  const leaveEvent = async (host, code) => {
    if (host) {
      await deleteDoc(doc(db, 'event'), where('eventcode', '==', code));
    } else {
      const unsubscribe = onSnapshot(collection(db, 'event'), () => {
        // Respond to data
      });
      unsubscribe();
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
