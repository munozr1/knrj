// Import the functions you need from the SDKs you need

// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGVCC1ZHzrkqpMlwKOlOyoxdTp0h2ReOA",
  authDomain: "fir-auth-11c69.firebaseapp.com",
  projectId: "fir-auth-11c69",
  storageBucket: "fir-auth-11c69.appspot.com",
  messagingSenderId: "831155633837",
  appId: "1:831155633837:web:22232270f4d4c3cad39024"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0) 
{
    app=firebase.initializeApp(firebaseConfig);
}
else
{
    app=firebase.app();
}

const auth =firebase.auth();

export {auth};

