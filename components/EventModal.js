import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ProgressViewIOSComponent, Easing, KeyboardAvoidingView, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpotifyContext } from '../providers/SpotifyProvider';
import Progressbar from './Progressbar';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Image style={styles.tinyLogo} source={item.album.images[2]} />
    <View style={[styles.itemTwo]}>
      <Text style={[styles.title, textColor]}>{item.name}</Text>
      <Text style={[styles.artists, textColor]}>{item.album.artists[0].name}</Text>
    </View>
    {
      //console.log('Item - ', item.album.artists[0].name)
    }
  </TouchableOpacity>
);

const eventmodal = (props) => {

  const [searchSong, setSearchSong] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

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

    if (searchSong != "") {
      const res = await search(searchSong);
      setSearchResults(res.tracks.items);
    }
  }

  const currentSongPlaying = async () => {
    console.log('eventmodal() => currentSongPlaying()');
    await currentlyPlaying();
  }

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "transparent" : "white";
    const color = item.id === selectedId ? 'black' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id)
          console.log('Song id - ', selectedId);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

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
            </View>

            <SafeAreaView style={styles.searchResultsContainer}>
              <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
              />
            </SafeAreaView>
            <View style={[
              styles.iconsCenter,
              styles.bottomView
            ]}>

              <TouchableOpacity onPress={() => setSearchClicked(!searchClicked)}>
                <Ionicons name="close" size={30} style={[{
                  marginRight: 50,
                  marginBottom: 3
                }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={searchConst}>
                <Ionicons name="search" size={30} style={[{
                  marginLeft: 50,
                  marginBottom: 3
                }]} />
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


              <TouchableOpacity onPress={() => setSearchClicked(!searchClicked)}
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
    height: 350,
    marginBottom: 25,
    opacity: .9
  },
  searchInputContainer: {
    backgroundColor: "white",
    borderRadius: 0,
    borderWidth: 0,
    height: 50,
    marginTop: 5,
    marginBottom: 0,
    opacity: 1,
    padding: 0,
  },
  searchResultsContainer: {
    flex: 1,
    marginTop: 0,
    marginBottom: 50,
    width: 325,
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
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    fontSize: 15,
    flexDirection: 'row',
  },
  itemTwo: {
    padding: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    fontSize: 15,
    flexDirection: 'column',
  },
  tinyLogo: {
    width: 50,
    height: 50,
    marginRight: 20
  },
  title: {
    paddingTop: 7,
    textAlign: 'left'
  },
  artists: {
    paddingTop: 0,
    textAlign: 'left'
  }
})


export default eventmodal;
