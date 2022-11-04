import React  from "react";
import { initializeApp } from 'firebase-admin/lib/app'
import { getAuth, PhoneAuthProvider, signInWithCredential, } from 'firebase/auth';

// create context
const AuthStateContext= React.createContext()

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
  const [$authState, $setAuthState] = React.useState({});
  const [verificationId, setVerificationId] = React.useState();
  const [message, showMessage] = React.useState();
  // const [verificationCode, setVerificationCode] = React.useState();



  const sendVerificationCode = async (phoneNumber, ref) => {
    //add phone number extenstion -> only in the us for now
    phoneNumber = '+1'+phoneNumber;
    console.log(phoneNumber);

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        ref.current
      );
      setVerificationId(verificationId);
      $setAuthState({...$authState, ...{phoneNumber, codeSent: true}});
      console.log('Successfully sent code to user: ', phoneNumber);
    } catch (err) {
      console.log(`err with ${phoneNumber} :`,err);
    }
  }


  const confirmVerificationCode = async (verificationCode) => {
    console.log("......Confirming Verification Code")
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const user = await signInWithCredential(auth, credential);
      console.log({ text: 'Phone authentication successful 👍', user });
    } catch (err) {
      console.log({ text: `Error: ${err.message}`, color: 'red' });
    }
  }

  return (
    // the Provider gives access to the context to its children
    <AuthStateContext.Provider
      value={{$authState,
      $setAuthState,
      sendVerificationCode,
      confirmVerificationCode,
      }}>
      
      {children}
    </AuthStateContext.Provider>
  );
};

export { AuthStateContext, AuthStateProvider, firebaseConfig, app };
