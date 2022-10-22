import { View,  StyleSheet, KeyboardAvoidingView, Keyboard, Modal} from 'react-native';
import React from 'react';
import SpotifyLogin from '../components/SpotifyLogin';
import CodeModal from '../components/CodeModal';
import LoginModal from '../components/LoginModal'
import AlbumCover from '../components/AlbumCover'
import { AuthStateContext } from '../providers/AuthProvider';


const Home = (props) => {
  const { $authState, $setAuthState } = React.useContext(AuthStateContext);
  const [ $event, $setEvent] = React.useState({});



  const verifyEventCode = (code) => {
    if(code === '1234')
    {
      $setEvent({...$event, ...{joined: true}})
    }
    console.log($event)
    Keyboard.dismiss();
  }


  const [modalVisible, setModalVisible] = React.useState(false);


  const animationTimeout = async () => {
    return new Promise((resolve, reject)=>{
      setTimeout(() => {
        setModalVisible(true);
        resolve();
      }, 2000);
    })
  }

  //timeout for modal animation slide up
  animationTimeout();

  return (
    <View style={{
      flex: 1,
      flexDirection: 'column'
    }}>
      <AlbumCover></AlbumCover>
        <Modal 
        animationType='slide' 
        visible={modalVisible}
        transparent
        > 
          {
          ($authState.authenticated && $event.joined) ?
            <KeyboardAvoidingView style={styles.bottomView} behavior='padding'>
              <SpotifyLogin topLabel={'Login with Spotify'} botLabel={'Tap to login'}></SpotifyLogin>
            </KeyboardAvoidingView>
            : null
          }
          {
          ($authState.authenticated && !$event.joined)?
          <KeyboardAvoidingView
          style={styles.bottomView}
          behavior='padding'
          >
            <CodeModal length={4} topLabel={'Event Code'} botLabel={'Join'} verify={verifyEventCode}></CodeModal>
          </KeyboardAvoidingView>
          : null
          }
          {
            (!$authState.authenticated) ?
              <KeyboardAvoidingView
              style={styles.bottomView}
              behavior='padding'
              >
                <LoginModal ></LoginModal>
              </KeyboardAvoidingView>
              : null
          }
        </Modal>
      
    </View>
  )
}

let styles = StyleSheet.create({
  container:{
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: 'white',
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
