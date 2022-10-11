import { View, Text, TouchableOpacity , StyleSheet} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodeModal from '../components/CodeModal';


const Home = ({navigation}) => {
  return (
    <View style={{
      backgroundColor: "white",
      flex: 1,
      // borderWidth: 4,
      // borderColor: "red"
    }}>
      <SafeAreaView>
        <Text>Welcome to the Home page!</Text>
      </SafeAreaView>
      <View style={styles.bottomView}>
        <CodeModal  botLabel={'verify'} topLabel={'Auth Code'}></CodeModal>
      </View>
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
    // overflow: 'hidden'
  },
  bottomView: {
    // position: 'absolute', //Here is the trick
    // bottom: 0, //Here is the trick
    marginTop: '50%',//TODO temp, should be on bottom then on click it should animate 50%
    marginLeft: 2,
    marginRight:2,
  }

})

export default Home;
