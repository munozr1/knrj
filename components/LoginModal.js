import { View,  StyleSheet, Modal, Keyboard} from 'react-native';
import React from 'react';
import CodeModal from './CodeModal'
import SingleInput from './SingleInput'
import { AuthStateContext } from '../providers/AuthProvider';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../providers/AuthProvider';



const loginmodal= (props) => {
  const { $authState,
          $setAuthState,
          sendVerificationCode,
          confirmVerificationCode,
        } = React.useContext(AuthStateContext);
  const recaptchaRef = React.useRef(null);

  const verifyPhone = (phone) =>{
    sendVerificationCode(phone, recaptchaRef);
  }

  const verifyAuthCode = (code) => {
    if (code.length === 6) {
      $setAuthState({ ...$authState, ...{ authenticated: true } });
      confirmVerificationCode(code)
    }
    Keyboard.dismiss();
  }

  return (
      <View style={[styles.container, styles.shadow]}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaRef}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      ></FirebaseRecaptchaVerifierModal>
        {
          ($authState.codeSent) ? 
          <CodeModal topLabel={'Auth Code'} botLabel={'Verify'} verify={verifyAuthCode}></CodeModal>
          :<SingleInput topLabel={'Phone Number'} botLabel={'Send Code'} submit={verifyPhone}></SingleInput>

        }
      </View>
  )
}


let styles = StyleSheet.create({
  input: {
    padding: 15,
    height: 60,
    margin: 12,
    width: 300,
    textAlign: 'center',
    fontSize: 35,
    borderRadius: 15,
  },
  shadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 1 / 3,
    elevation: 1,
    backgroundColor: "white", // invisible color
  }
  ,
  container: {
    backgroundColor: "white",
    borderRadius: 37,
    height: 250,
  },
  label: {
    textAlign: "center",
    padding: "3%",
    fontWeight: '800'
  },
  botLabel: {
    marginTop: 100,
    width: '100%',
  },
  hiddenCodeInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0,
  },
})



export default loginmodal;
