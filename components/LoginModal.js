import { View,  StyleSheet, Modal} from 'react-native';
import React from 'react';
import CodeModal from './CodeModal'
import SingleInput from './SingleInput'
import { AuthStateContext } from '../providers/AuthProvider';



const loginmodal= (props) => {
  const { $authState, $setAuthState } = React.useContext(AuthStateContext);

  const verifyPhone = (phone) =>{
    $setAuthState({...$authState, ...{phone, codeSent: true}});
  }

  return (
      <View style={[styles.container, styles.shadow]}>
        {
          ($authState.codeSent) ? 
          <CodeModal topLabel={'Auth Code'} botLabel={'Verify'} verify={props.verifyAuthCode}></CodeModal>
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
