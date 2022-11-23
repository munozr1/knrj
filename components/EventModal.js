import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ProgressViewIOSComponent, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpotifyContext } from '../providers/SpotifyProvider';
import Progressbar from './Progressbar';
import Animated from 'react-native-reanimated';

const eventmodal = (props) => {
  const {
    play,
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

  React.useEffect(()=>{
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

  const voteSkip = async () => {
    console.log('eventmodal => voteSkip()')
    await skip();
  }

  const searchConst = async() => {
    console.log('eventmodal => search()');
  }

  const currentSongPlaying = async() => {
    console.log('eventmodal() => currentSongPlaying()');
    await currentlyPlaying();
  }

  return (
    <View style={[styles.container, styles.shadow, {
      alignItems: 'center',
    }]}>
      <View>
        <Text style={styles.label} numberOfLines={1}>{props.song.name}</Text>
        <Text style={styles.secondLabel} numberOfLines={1}>
          {props.song.album.artists[0].name}
        </Text>
      </View>
      <View style={styles.Parentdiv}>
        <Animated.View style={[styles.Childdiv, {
          width:progress.animation.interpolate({
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

        
        <TouchableOpacity onPress={props.voteBack}
          style={[{
          }]}
        >
        <Ionicons name="play-skip-back-outline" size={38} style={[{
          marginRight: 50,
          marginBottom: 5
          }]} />
        </TouchableOpacity>

        
        <TouchableOpacity onPress={searchConst}
          style={[{
          }]}
        >
        <Ionicons name="search" size={38} style={[{
          marginRight: 50,
          marginBottom: 5
          }]} />
        </TouchableOpacity>
        

        <TouchableOpacity onPress={voteSkip}
          style={[{
          }]}
        >
        <Ionicons name="play-forward" size={38} style={[{
            marginBottom: 5
            }]} />
        </TouchableOpacity>
      </View>
      
      {!clicked && <Text style={styles.title}>Type a song name...</Text>}
      <Search
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />
    </View>
  );
};


let styles = StyleSheet.create({
  iconsCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
    justifyContent: 'center',
  },
  input: {
    padding: 15,
    height: 80,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 5,
    marginRight: 5,
    width: 55,
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
    borderRadius: 17,
    height: 130,
    marginBottom: 25,
    opacity: .7 
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
  Parentdiv : {
    height: 5,
    width: '90%',
    backgroundColor: 'whitesmoke',
    borderRadius: 40,
    // margin: 80
    marginLeft: 10,
    marginRight: 10
  },
      
  Childdiv : {
    // width: '30%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 40,
    textAlign: 'right'
  },
      
  progresstext : {
    padding: 10,
    color: 'black',
    // fontWeight: 900
  }
})


export default eventmodal;
