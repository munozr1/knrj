import React, { createContext, useState } from "react";
import { initializeApp} from 'firebase/app'
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
// create context
const AuthStateContext= createContext();

const firebaseConfig = {
  apiKey: "AIzaSyDGVCC1ZHzrkqpMlwKOlOyoxdTp0h2ReOA",
  authDomain: "fir-auth-11c69.firebaseapp.com",
  projectId: "fir-auth-11c69",
  storageBucket: "fir-auth-11c69.appspot.com",
  messagingSenderId: "831155633837",
  appId: "1:831155633837:web:22232270f4d4c3cad39024"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const AuthStateProvider = ({ children }) => {
  // the value that will be given to the context
  const [$authState, $setAuthState] = useState({});

  //Authenticate using firebase
  // useEffect((phone) => {
  //   //TODO authenticate with firebase logic goes in here
  //   $setAuthState({ ...$authState, ...{ phone, codeSent: true } });
  //   }, []);

  return (
    // the Provider gives access to the context to its children
    <AuthStateContext.Provider value={{$authState, $setAuthState}}>
      {children}
    </AuthStateContext.Provider>
  );
};

export { AuthStateContext, AuthStateProvider };
