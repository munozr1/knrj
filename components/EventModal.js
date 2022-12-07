import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpotifyContext } from '../providers/SpotifyProvider';
import { DBContext } from '../providers/FirestoreProvider';
import SearchModal from './SearchModal';
import QueueModal from './QueueModal';
import Animated from 'react-native-reanimated';

const eventmodal = (props) => {

  const [pauseClicked, setPausedClicked] = useState(false);
  const [playClicked, setPlayClicked] = useState(false);
  const [state, setState] = useState({
    animationValue: new Animated.Value(100),
    viewState: true
  });

  const {
    addSkipCount,
    enqueue

  } = React.useContext(DBContext);

  const {
    resumePlay,
    pause,
    skip,
    currentlyPlaying,
    duration,
    play
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
    console.log('Search - ', searchClicked);
  }, [searchClicked]);

  React.useEffect(() => {
    console.log('Queue - ', queueClicked);
  }, [queueClicked]);

  return (
    <View>
      {
        (!queueClicked && !searchClicked) ?
          <>
            <View style={styles.container}>
              <View>
                <Text style={styles.label} numberOfLines={1}>{props.song.name}</Text>
                <Text style={styles.secondLabel} numberOfLines={1}>
                  {props.song.album.artists[0].name}
                </Text>
              </View>
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
                >
                  <Ionicons name={pauseClicked ? "play" : "pause"} size={38} style={[{
                    marginRight: 50,
                    marginBottom: 5
                  }]} />
                </TouchableOpacity>


                <TouchableOpacity onPress={voteSkip}
                >
                  <Ionicons name="play-skip-forward-outline" size={38} style={[{
                    marginBottom: 5
                  }]} />
                </TouchableOpacity>
              </View>
            </View>
          </>
          :
          null
      }
      {
        (queueClicked) ?
          <>
            <View style={styles.queueContainer}>
              <QueueModal close={() => setQueueClicked(!queueClicked)} />
            </View>
          </>
          :
          null
      }
      {
        (searchClicked) ?
          <>
            <View style={styles.searchContainer}>
              <SearchModal close={() => setSearchClicked(!searchClicked)} />
            </View>
          </>
          :
          null
      }
    </View>
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
  container: {
    backgroundColor: "white",
    height: 130,
    borderRadius: 17,
  },
  searchContainer: {
    backgroundColor: "white",
    height: 500,
    borderRadius: 17,
  },
  queueContainer: {
    backgroundColor: "white",
    height: 500,
    borderRadius: 17,
  },
  label: {
    textAlign: "center",
    padding: "0%",
    fontWeight: '800',
    fontSize: 20,
    marginTop: 15,
    marginBottom: 2,
  },
  secondLabel: {
    textAlign: "center",
    padding: "0%",
    fontWeight: '500',
  },
  optionalLable: {
    borderWidth: 1
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
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
