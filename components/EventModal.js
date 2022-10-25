import { View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable, Keyboard } from 'react-native';
import { useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const eventmodal = (props) => {
  

  return (
    <View style={[styles.container, styles.shadow, {
      alignItems: 'center',
      // borderColor: 'red',
      // borderWidth: 1
    }]}>
      <View>
        <Text style={styles.label}>{"Rock and a Hard Place"}</Text>
        <Text style={styles.secondLabel}>{"Bailey Zimmerman"}</Text>
      </View>
      <View style={[
      styles.iconsCenter,
      styles.bottomView
      ]}>

        <Ionicons name="play-back" size={38} style={[{
            marginRight: 50,
            marginBottom: 5
          }]}/>
        <Ionicons name="search" size={38} style={[{
            marginRight: 50,
            marginBottom: 5
            }]} />
        <Ionicons name="play-forward" size={38} style={[{
            marginBottom: 5
            }]} />
      </View>

    </View>
  )
}


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
  },
  label: {
    textAlign: "center",
    padding: "0%",
    fontWeight: '800',
    opacity: .9,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10
  
  },
  secondLabel: {
    textAlign: "center",
    padding: "0%",
    fontWeight: '500',
    // color: 'grey',
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
    width: '97%'
  },
})



export default eventmodal;
