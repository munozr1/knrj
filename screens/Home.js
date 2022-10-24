import { View,  StyleSheet, KeyboardAvoidingView, Keyboard, Modal, Image, ImageBackground, TouchableOpacity} from 'react-native';
import React from 'react';
import SpotifyLogin from '../components/SpotifyLogin';
import CodeModal from '../components/CodeModal';
import LoginModal from '../components/LoginModal'
import AlbumCover from '../components/AlbumCover'
import { AuthStateContext } from '../providers/AuthProvider';


const Home = (props) => {
  const { $authState, $setAuthState, $spotifyState, $setSpotifyAuthState } = React.useContext(AuthStateContext);
  const [ event, setEvent] = React.useState({});
  const [backgroundImage, setBackgroundImage] =React.useState('https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228');
  const [bgColor, setbgColor] = React.useState('');



  const joinInstead = ()=>{
    setEvent({...event, ...{hosting: false}});
  }

  const verifyEventCode = (code) => {
    if(code === '1234')
    {
      setEvent({...event, ...{joined: true}})
    }
    console.log(event)
    Keyboard.dismiss();
  }

  const hostInstead = ()=>{
    setEvent({...event, hosting: true})
    console.log('Show Hosting Modal');
  }


  const [modalVisible, setModalVisible] = React.useState(false);


  const modalTimeout = async () => {
    return new Promise((resolve, reject)=>{
      setTimeout(() => {
        setModalVisible(true);
        resolve();
      }, 1000);
    })
  }

  //timeout for modal animation slide up
  React.useEffect(()=>{
    setModalVisible(false);
    modalTimeout();
  }, [$authState,event])
  // modalTimeout();

  React.useEffect(()=>{
    setbgColor()
  },[bgColor])


  return (
    <View style={{
      // flex: 1,
      // flexDirection: 'column'
    }}
    >
      <ImageBackground
        style={[styles.background,{
          backgroundColor: bgColor
        }]}
        source={{uri: backgroundImage}}
        blurRadius={10}
      >
        <AlbumCover></AlbumCover>
        {/* <Modal 
        animationType='slide' 
        visible={modalVisible}
        transparent
        > 
          {
            ($authState.authenticated && event.hosting && !$spotifyState.user) ?
            // (true) ?
            <KeyboardAvoidingView
            style={styles.bottomView}
            >
              <SpotifyLogin back={joinInstead}  label={'Connect with Spotify'}></SpotifyLogin>
            </KeyboardAvoidingView>
            :null
          }
          {
          ($authState.authenticated && !event.joined && !event.hosting)?
          <KeyboardAvoidingView
          style={styles.bottomView}
          behavior='padding'
          >
            <CodeModal length={4} 
            topLabel={'Event Code'} 
            botLabel={'Join'} 
            verify={verifyEventCode}
            secondAction={hostInstead}
            secondLabel={'Host Instead'}
            ></CodeModal>
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
        </Modal> */}
      
      </ImageBackground>
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
  },
  background: {
    // position: 'absolute',
    height:'100%' ,
    width: '100%' ,
    resizeMode: 'stretch',
    // top:-100,
    // left:0
    
  }

})

export default Home;
