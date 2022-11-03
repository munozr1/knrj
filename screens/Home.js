import { View,  StyleSheet, KeyboardAvoidingView, Keyboard, Modal, Image, ImageBackground, TouchableOpacity, SafeAreaView, Animated} from 'react-native';
import React from 'react';
import SpotifyLogin from '../components/SpotifyLogin';
import CodeModal from '../components/CodeModal';
import LoginModal from '../components/LoginModal'
import AlbumCover from '../components/AlbumCover'
import EventModal from '../components/EventModal'
import { AuthStateContext } from '../providers/AuthProvider';
import { DBContext } from '../providers/FirestoreProvider';
import { IMAGE, SpotifyContext } from '../providers/SpotifyProvider';

const Home = (props) => {
  const { $authState,
          $setAuthState,
        } = React.useContext(AuthStateContext);
  const {
          done,
          setDone,
          $spotifyState,
          $setSpotifyAuthState,
          modalVisible,
          setModalVisible,
          song,
          setBackgroundImage,
        } = React.useContext(SpotifyContext);
  const {
    findEvent,
    createEvent
  } = React.useContext(DBContext)

  const [event, setEvent] = React.useState({});
  const [bgColor, setbgColor] = React.useState('');


  const spotifyToken = (token) => {
    $setSpotifyAuthState({...$spotifyState, ...{token}})
  }


  const resetAuth = ()=>{
    console.log('reseting auth')
    setBackgroundImage(IMAGE);
    $setAuthState({});
    setEvent({});
    setDone(false);
    setModalVisible(true);
  }
  
  const resetEvent = ()=>{
    setBackgroundImage(IMAGE);
    setEvent({});
    setDone(false);
    setModalVisible(true)
  }

  const joinInstead = ()=>{
    setEvent({...event, ...{hosting: false}});
  }

  const verifyEventCode = async (code) => {
    const eventExists = await findEvent(code);
    console.log('eventExists', eventExists);
    if(eventExists)
    {
      setEvent({...event, ...{joined: true}});
      setDone(true);
      setModalVisible(false);
    }
    console.log(event)
    Keyboard.dismiss();
  }

  const hostInstead = ()=>{
    setEvent({...event, hosting: true})
    console.log('Show Hosting Modal');
  }

  const voteSkip = ()=>{
    console.log("voteSkip")
  }

  const search = () => {
    console.log("search")
  }

  const voteBack = () => {
    console.log("voteBack")
  }

  const play = (song) => {

  }


  


  const modalTimeout = async () => {
    console.log('modalTimeout() => done: ', done);
    return new Promise((resolve, reject)=>{
      setTimeout(() => {
        if(!done)
          setModalVisible(true);
        resolve();
      }, 1000);
    })
  }

  //timeout for modal animation slide up
  React.useEffect(()=>{

    if ($authState.authenticated && event.hosting && $spotifyState) {
      //createEvent($authState.number);
      console.log('Event created');
    }

    setModalVisible(false);
    if(!done)
      modalTimeout();
  }, [event, $spotifyState])
  // modalTimeout();

  React.useEffect(()=>{

  }, [song])

  const backgroundFade= React.useRef(new Animated.Value(0)).current;

  const backgroundFadeIn =() => {
    Animated.timing(backgroundFade, {
      toValue: 1,
      duration: 2000
    }).start()
  }


  const backgroundFadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000
    }).start();
  };

  return (
    <View style={{
      // flex: 1,
      // flexDirection: 'column'
    }}
    >
      
      <ImageBackground
        style={[styles.background,{
          backgroundColor: bgColor,
          alignItems: 'center'
        }]}
        source={{uri: song.album.images[0].url}}
        blurRadius={10}
      >
        <AlbumCover 
        resetAuth={resetAuth} 
        resetEvent={resetEvent}
        bgImage={song.album.images[0].url}
        ></AlbumCover>
        <SafeAreaView
        style={[{
          alignItems: 'center'
        },styles.bottomView]}>
          <KeyboardAvoidingView
            style={styles.bottomView}
            behavior='padding'
          >
            <EventModal 
            song={song}
            voteSkip={voteSkip}
            search={search}
            voteBack={voteBack}
            ></EventModal>
          </KeyboardAvoidingView >
        </SafeAreaView>

        
        <Modal 
        animationType='slide' 
        visible={modalVisible}
        // visible={false}
        transparent
        > 
        
          {
            ($authState.authenticated && event.hosting && !$spotifyState.token) ?
            // (!$spotifyState.user && !$spotifyState.token) ?
            // (true) ?
            <KeyboardAvoidingView
            style={styles.modalStyles}
            >
              <SpotifyLogin  
              back={joinInstead}  
              label={'Connect with Spotify'}
              setSpotifyToken={spotifyToken}
              done={setDone}
              ></SpotifyLogin>
            </KeyboardAvoidingView>
            :null
          }
          {
          ($authState.authenticated && !event.joined && !event.hosting)?
          <KeyboardAvoidingView
          style={styles.modalStyles}
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
              style={styles.modalStyles}
              behavior='padding'
              >
                <LoginModal ></LoginModal>
              </KeyboardAvoidingView>
              : null
          }
        </Modal>
      
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
   // marginLeft: 2,
    //marginRight:2,
    width:'97%'
  },
  modalStyles: {
  position: 'absolute', //Here is the trick
  bottom: 0, //Here is the trick
  // marginTop: '50%',//TODO temp, should be on bottom then on click it should animate 50%
  // marginLeft: 2,
  //marginRight:2,
  width: '100%'
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
