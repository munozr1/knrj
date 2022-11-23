import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ProgressViewIOSComponent, Easing, KeyboardAvoidingView, VirtualizedList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpotifyContext } from '../providers/SpotifyProvider';
import Progressbar from './Progressbar';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const DATA = [];

const getItem = (data, index) => ({

});

const getItemCount = (data) => 10;

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const eventmodal = (props) => {

  const [searchSong, setSearchSong] = useState("");

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

  const voteSkip = async () => {
    console.log('eventmodal => voteSkip()')
    await skip();
  }

  const searchConst = async () => {
    console.log('eventmodal => search()');
    console.log('Song Entered - ', searchSong);
    setSearchClicked(!searchClicked);

    if (searchSong != "") {
      const results = await search(searchSong);
      console.log('Song results - ', results);
    }
  }

  /*
              <VirtualizedList
              data={DATA}
              initialNumToRender={5}
              renderItem={({ item }) => <Item title={item.title} />}
              keyExtractor={item => item.key}
              getItemCount={getItemCount}
              getItem={getItem}
            />
            */

  const currentSongPlaying = async () => {
    console.log('eventmodal() => currentSongPlaying()');
    await currentlyPlaying();
  }

  return (
    <SafeAreaView style={[searchClicked ? styles.searchContainer : styles.container, styles.shadow, {
      alignItems: 'center',
    }]}>
      {
        (searchClicked) ?
          <>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.input}
                placeholder='Enter a song'
                value={searchSong}
                onChangeText={setSearchSong} />

              <TouchableOpacity onPress={() => console.log(searchSong)}
                style={[
                  styles.iconsCenter
                ]}
              >
                <Ionicons name="search" size={20} style={[{
                  marginRight: 25,
                  marginBottom: 5
                }]} />
              </TouchableOpacity>
            </View>


            <View style={[
              styles.iconsCenter,
              styles.bottomView
            ]}>

              <TouchableOpacity onPress={searchConst}>
                <Text style={styles.secondLabel} numberOfLines={1}>Close</Text>
              </TouchableOpacity>

            </View>
          </>
          :
          <>
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
    // borderColor: 'red',
    // borderWidth: 1,
    justifyContent: 'center',
  },
  iconsRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
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
    backgroundColor: 'white',
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
    backgroundColor: "",
    borderRadius: 17,
    height: 350,
    marginBottom: 25,
    opacity: .9
  },
  searchInputContainer: {
    backgroundColor: "black",
    borderRadius: 0,
    borderWidth: 0,
    height: 75,
    marginTop: 5,
    opacity: 1,
    padding: 2
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
  }
})


export default eventmodal;
