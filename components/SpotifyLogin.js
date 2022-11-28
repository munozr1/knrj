import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as React from 'react';
import { SpotifyContext } from '../providers/SpotifyProvider';


const spotifylogin = (props) => {

  const {
    promptAsync
  } = React.useContext(SpotifyContext);

  return (
    <View style={[styles.container, styles.shadow]}>
      <View>
        <TouchableOpacity onPress={() => { props.back() }}
          style={[{
            width: 150,
            marginBottom: 1
          }]}
        >
          <Text style={styles.secondLabel}>{'Join Instead'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ width: 170 }} onPress={() => {
        promptAsync();
        props.onClick();
      }}>
        <Text style={styles.label}>{props.label}</Text>
      </TouchableOpacity>
    </View>
  )
}

let styles = StyleSheet.create({
  input: {
    padding: 15,
    height: 60,
    margin: 12,
    width: 300,
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
  },
  container: {
    backgroundColor: "white",
    borderRadius: 37,
    height: 250,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  label: {
    textAlign: "center",
    padding: "3%",
    fontWeight: '800',
    color: '#1DB954'
  },
  botLabel: {
    marginTop: 100,
    width: '100%',
  },
  hiddenCodeInput: {
    position: 'absolute',
    height: 0,
    width: 0,
    opacity: 0,
  },
  secondLabel: {
    textAlign: "center",
    padding: "3%",
    fontWeight: '500',
    // color: 'grey',
    opacity: 0.2,
  },
})


export default spotifylogin
