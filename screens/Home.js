import { View, StyleSheet, KeyboardAvoidingView, Keyboard, Modal, ImageBackground, Animated } from 'react-native';
import * as React from "react";
import SpotifyLogin from '../components/SpotifyLogin';
import CodeModal from '../components/CodeModal';
import LoginModal from '../components/LoginModal'
import AlbumCover from '../components/AlbumCover'
import EventModal from '../components/EventModal'
import { AuthStateContext } from '../providers/AuthProvider';
import { DBContext } from '../providers/FirestoreProvider';
import { IMAGE, SpotifyContext } from '../providers/SpotifyProvider';
import { doc } from 'firebase/firestore';

const Home = (props) => {

  const {
    $authState,
    $setAuthState,
  } = React.useContext(AuthStateContext);

  // TODO: Fix modalVisible, should not be controlled by spotify context
  // TODO: Implement other music providers
  const {
    done,
    setDone,
    $spotifyState,
    // $setSpotifyAuthState,
    modalVisible,
    setModalVisible,
    song,
    setBackgroundImage,
    logIntoSpotify,
    token,
    setToken,
    currentlyPlaying,
    currentSong
  } = React.useContext(SpotifyContext);

  const {
    code,
    setCode,
    findEventByCode,
    createEvent,
    joinEvent,
    leaveEvent,
    updateCurrntlyPlayingSong,
    updateEventToken,
    firestoreEvent
  } = React.useContext(DBContext);

  const [event, setEvent] = React.useState({hosting: true});
  const [bgColor, setbgColor] = React.useState('');



  const hostInstead = () => {
    // createEvent($authState.phoneNumber);
    setEvent({ ...event, hosting: true })
  }

  const joinInstead = () => {
    setEvent({ ...event, ...{ hosting: false } });
  }

  const spotifyToken = (token) => {
    // $setSpotifyAuthState({ ...$spotifyState, ...{ token } })
    setToken(token);
  }

  const resetAuth = () => {
    setBackgroundImage(IMAGE);
    $setAuthState({});
    setEvent({});
    setDone(false);
    setModalVisible(true);

    console.log('Resetting auth');
  }

  const resetEvent = async () => {
    try{
      setBackgroundImage(IMAGE);
      await leaveEvent(event.hosting);
      setEvent({});
      setDone(false);
      setModalVisible(true)
      console.log('Resetting event');
    } catch (err) {
      console.log('Home.js - resetEvent() - Error: ', err);
      throw err;
    }
  }

  const createNewEvent = async (response) => {
    console.log("Creating new event: ", $authState.phoneNumber);
    // newly created event
    let e;
    try {
      await logIntoSpotify(response);
      const track = await currentSong(response.params.access_token);
      console.log('track: ', track);
      // e = await createEvent($authState.phoneNumber, response.params.access_token, track);
      e = await createEvent("+2147794304", response.params.access_token, track);
      // set the event state
      if(e){
        setEvent({...e, ...event, ...{hosting: true}});
        setDone(true);
        setModalVisible(false);
        setToken(response.params.access_token);
      }
    } catch (err) {
      console.log('Home.js - createNewEvent() - Error: ', err);
      throw e;
    }
    
  }


  const verifyEventCode = async (code) => {
    const eventExists = await findEventByCode(code);

    if (eventExists && code) {
      setCode(Number(code));
      await joinEvent(code);
      setDone(true);
      setModalVisible(false);
    }
    Keyboard.dismiss();
  }

  const modalTimeout = async () => {
    //console.log('modalTimeout() => done: ', done);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!done)
          setModalVisible(true);
        resolve();
      }, 1000);
    })
  }


  React.useEffect(() => {
    if(token){
      // updateEventToken(token);
      currentlyPlaying();
    }
    return;
  }, [token]);

  // React.useEffect(() => {
  //   setEvent({ ...event, ...firestoreEvent })
  //   setToken(firestoreEvent.spotify_token);
  //   currentlyPlaying()
  // }, [firestoreEvent]);

  // React.useEffect(() => {
  //   updateCurrntlyPlayingSong(song);
  //   return;
  // }, [song]);

  // Timeout for modal animation slide up
  React.useEffect(() => {
    // console.log(event);

    setModalVisible(false);
    if (!done) {
      modalTimeout();
    }
  }, [event]);

  React.useEffect(() => {
    setEvent({ ...event, ...{ event_code: code } });
  }, [code]);

  React.useEffect(() => {
    console.log('Spotify Logged In: ', $spotifyState);
  }, [event]);

  // React.useEffect(() => {
  //   console.log('Spotify Logged In: ', $spotifyState);

  //   setModalVisible(false);
  //   if (!done) {
  //     modalTimeout();
  //   }
  // }, [$spotifyState]);

  return (
    <View>
      <ImageBackground
        style={[styles.background, {
          backgroundColor: bgColor,
          alignItems: 'center'
        }]}
        source={{ uri: song.album.images[0].url }}
        blurRadius={10}
      >
        <AlbumCover
          resetAuth={resetAuth}
          resetEvent={resetEvent}
          bgImage={song.album.images[0].url}
        />

        <KeyboardAvoidingView
          style={styles.bottomView}
          behavior='padding'
        >
          <EventModal
            song={song}
            event={event}
          />
        </KeyboardAvoidingView >


        <Modal
          animationType='slide'
          visible={modalVisible}
          // transparent
        >
          {
            // (true) ?
            ($authState.authenticated && event.hosting && !token)?
            // (event.hosting && !token)?
              <KeyboardAvoidingView
                style={styles.modalStyles}
              >
                <SpotifyLogin
                  back={joinInstead}
                  label={'Connect with Spotify'}
                  done={setDone}
                  onClick={createNewEvent}
                />
              </KeyboardAvoidingView>
              : null
          }
          {
            ($authState.authenticated && !event.code && !event.hosting) ?
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
                />
              </KeyboardAvoidingView>
              : null
          }
          {
            (!$authState.authenticated) ?
              <KeyboardAvoidingView
                style={styles.modalStyles}
                behavior='padding'
              >
                <LoginModal />
              </KeyboardAvoidingView>
              : null
          }
        </Modal>
      </ImageBackground>
    </View>
  )
}

let styles = StyleSheet.create({
  container: {
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
    position: 'absolute',
    marginBottom: 20,
    bottom: 0,
    width: '97%'
  },
  modalStyles: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  background: {
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  }
})

export default Home;
