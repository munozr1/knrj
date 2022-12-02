import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ProgressViewIOSComponent, Easing, KeyboardAvoidingView, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpotifyContext } from '../providers/SpotifyProvider';
import { DBContext } from '../providers/FirestoreProvider';
import SearchModal from './SearchModal';
import QueueModal from './QueueModal';
import Progressbar from './Progressbar';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';

const eventmodal = (props) => {

  const [pauseClicked, setPausedClicked] = useState(false);
  const [state, setState] = useState({
    animationValue: new Animated.Value(100),
    viewState: true
  });


  const {
    updateCurrentPlayingSong,
    addSkipCount,
    resetSkipCount,
    findEvent,
    createEvent,
    joinEvent,
    leaveEvent,
    enqueue,
    queue,
    dequeue
  } = React.useContext(DBContext);

  const {
    play,
    resumePlay,
    pause,
    skip,
    search,
    currentlyPlaying,
    duration,
    progressMs,
    song
  } = React.useContext(SpotifyContext);

  const progress = {
    animation: new Animated.Value(0)
  }

  const toggleAnimation = () => {

    if (state.viewState == true) {
      Animated.timing(this.state.animationValue, {
        toValue: 300,
        timing: 1500
      }).start(() => {
        setState({ viewState: false })
      });
    }
    else {
      Animated.timing(this.state.animationValue, {
        toValue: 100,
        timing: 1500
      }).start(setState({ viewState: true })
      );
    }
  }

  React.useEffect(() => {
    // console.log('START PROGRESS BAR');
    // console.log('duration: ', duration)
    // console.log('progressMs: ', progressMs)
    // progressBar();
    Animated.timing(progress.animation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false
    })


    Animated.timing(progress.animation, {
      toValue: 100,
      duration: 20000,
      useNativeDriver: false,
      easing: Easing.ease
    }).start();
    // console.log('progress.current: ', progress.current)
  }, [duration]);

  // Should default to false 
  const [searchClicked, setSearchClicked] = useState(false);
  const [queueClicked, setQueueClicked] = useState(false);

  const voteSkip = async () => {
    console.log('eventmodal => voteSkip()')
    await skip();

    addSkipCount();
    // Change skip() for host only
  }

  const currentSongPlaying = async () => {
    console.log('eventmodal() => currentSongPlaying()');
    await currentlyPlaying();
  }

  const showSearch = () => {
    setSearchClicked(!searchClicked);
    toggleAnimation();
  }

  React.useEffect(() => {
    console.log(searchClicked);
  }, [searchClicked]);

  React.useEffect(() => {
    console.log(queueClicked);
  }, [queueClicked]);

  return (
    <SafeAreaView style={[searchClicked ? styles.searchContainer : (queueClicked ? styles.queueContainer : styles.container), styles.shadow, {
      alignItems: 'center',
    }]}>
      {
        (searchClicked) ?
          <>
            <SearchModal close={() => setSearchClicked(!searchClicked)} />
          </>
          :
          <>
            <View>
              <Text style={styles.label} numberOfLines={1}>{props.song.name}</Text>
              <Text style={styles.secondLabel} numberOfLines={1}>
                {props.song.album.artists[0].name}
              </Text>
            </View>
            
            {
             (queueClicked) ?
             //
             <> 
              <QueueModal close={() => setQueueClicked(!queueClicked)} />
            </>
             :
             <>
            <View style={styles.Parentdiv}>
              <Animated.View style={[styles.Childdiv, {
                width: progress.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }]}>
                <Text style={[styles.progresstext]}></Text>
              </Animated.View>
            </View>
            <View>
            </View>
            <View style={[
              styles.iconsCenter,
              styles.bottomView
            ]}>
              <TouchableOpacity onPress={() => setSearchClicked(!searchClicked)}>
                <Ionicons name="search" size={38} style={[{
                  marginRight: 50,
                  marginBottom: 5
                }]} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setQueueClicked(!queueClicked)}>
                <Ionicons name="list-circle-outline" size={38} style={[{
                  marginRight: 50,
                  marginBottom: 5
                }]} />
              </TouchableOpacity>

              <TouchableOpacity onPress={async () => {
                if (pauseClicked) {
                  await resumePlay();
                } else {
                  await pause();
                }
                setPausedClicked(!pauseClicked);
              }}
                style={[{
                }]}
              >
                <Ionicons name={pauseClicked ? "play" : "pause"} size={38} style={[{
                  marginRight: 50,
                  marginBottom: 5
                }]} />
              </TouchableOpacity>


              <TouchableOpacity onPress={voteSkip}
                style={[{
                }]}
              >
                <Ionicons name="play-skip-forward-outline" size={38} style={[{
                  marginBottom: 5
                }]} />
              </TouchableOpacity>
            </View>
          </>
      }
       </>
      }
      
    </SafeAreaView>
  )
};


const styles = StyleSheet.create({
  iconsCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    opacity: 1,
  },
  input: {
    padding: 10,
    height: 35,
    marginTop: 12,
    marginLeft: 5,
    marginRight: 5,
    width: 300,
    textAlign: 'left',
    fontSize: 20,
    borderRadius: 15,
    backgroundColor: 'ghostwhite',
    opacity: 1
  },
  shadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 1 / 3,
    elevation: 1,
    backgroundColor: "white", // invisible color
  },
  container: {
    borderRadius: 17,
    height: 130,
    marginBottom: 25,
    opacity: .9
  },
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 17,
    height: 500,
    marginBottom: 25,
    opacity: 1
  },
  queueContainer: {
    backgroundColor: "red",
    borderRadius: 17,
    height: 500,
    marginBottom: 25,
    opacity: 1
  },
  label: {
    textAlign: "center",
    padding: "0%",
    fontWeight: '800',
    opacity: .9,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 2,
    maxWidth: '80%',
    // opacity: '100%'
  },
  secondLabel: {
    textAlign: "center",
    padding: "0%",
    fontWeight: '500',
    // borderColor: 'red',
    // borderWidth: 1
    // color: 'grey',
    // marginBottom: '%'
  },
  optionalLable: {
    borderWidth: 1
  },
  botLabel: {
    marginTop: 120,
    width: '100%',
  },
  hiddenCodeInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0,
  },
  bottomView: {
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    // marginTop: '50%',//TODO temp, should be on bottom then on click it should animate 50%
    // marginLeft: 2,
    //marginRight:2,
    width: '97%',
    marginBottom: '3%'
  },
  Parentdiv: {
    height: 5,
    width: '90%',
    backgroundColor: 'whitesmoke',
    borderRadius: 40,
    // margin: 80
    marginLeft: 10,
    marginRight: 10
  },
  Childdiv: {
    // width: '30%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 40,
    textAlign: 'right'
  },
  progresstext: {
    padding: 10,
    color: 'black',
    // fontWeight: 900
  },
})


export default eventmodal;
