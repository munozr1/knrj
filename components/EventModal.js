import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpotifyContext } from '../providers/SpotifyProvider';
import Search from './Search';
import List from './List';


const eventmodal = (props) => {

  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

  const {
    skip,
    search,
    currentlyPlaying
  } = React.useContext(SpotifyContext);

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
        <Text style={styles.secondLabel} numberOfLines={1}>{props.song.album.artists[0].name}</Text>
      </View>
      <View style={[
        styles.iconsCenter,
        styles.bottomView
      ]}>

        
        <TouchableOpacity onPress={props.voteBack}
          style={[{
          }]}
        >
        <Ionicons name="play-back" size={38} style={[{
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
    backgroundColor: "white",
    borderRadius: 37,
    height: 130,
    marginBottom: 25,
    opacity: .8
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
  title: {
    width: "100%",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "10%",
  }
})


export default eventmodal;
