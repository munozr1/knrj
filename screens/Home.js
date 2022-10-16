import { View, Text, TouchableOpacity , StyleSheet, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodeModal from '../components/CodeModal';


const Home = ({navigation}) => {
  const authenticated = false;
  const verifyCode = (code) => {
    (code === '1234') ? console.log(true) : console.log(false)
  }
  return (
    <View style={{
      backgroundColor: "white",
      flex: 1,
      // borderWidth: 4,
      // borderColor: "red"
    }}>
      {/* <SafeAreaView>
        <Text>Welcome to the Home page!</Text>
      </SafeAreaView> */}
      <KeyboardAvoidingView
      style={styles.bottomView}
      behavior='padding'
      >
        <CodeModal  botLabel={'verify'} topLabel={'Auth Code'} verify={verifyCode}></CodeModal>
      </KeyboardAvoidingView> 
      
    </View>
  )
}

let styles = StyleSheet.create({
  container:{
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: 'white',
    // height: '100%',
    // justifyContent: 'center',
    // flex: 1
  },
  bot: {
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
    bottom: 0,
  },
  bottomView: {
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    // marginTop: '50%',//TODO temp, should be on bottom then on click it should animate 50%
    marginLeft: 2,
    marginRight:2,
    width:'100%'
  }

})

export default Home;
