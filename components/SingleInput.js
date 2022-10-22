import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import React, { useState } from 'react';



const singleinput = (props) => {
  //stores the user input
  const [input, setInput] = useState('');

  return (
    <View style={[styles.container, styles.shadow]}>
      <View >
        <Text style={[styles.label]} >{props.topLabel}</Text>
      </View>
      <View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          maxHeight: 100,
          marginTop: 10,
        }}>
          <TextInput
            style={[styles.input, { borderWidth: 1, borderColor: '#9ea9ba' }]}
            maxLength={10}
            keyboardType={'number-pad'}

            //update variable with user input
            onChangeText={setInput}
            //default value of input before user types anything
            value={input}
          >
          </TextInput>
        </View>
      </View>
      <TouchableOpacity onPress={() => { props.submit(input) }} style={styles.botLabel}>
        <Text style={styles.label}>{props.botLabel}</Text>
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
  }
  ,
  container: {
    backgroundColor: "white",
    borderRadius: 37,
    height: 250,
  },
  label: {
    textAlign: "center",
    padding: "3%",
    fontWeight: '800'
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
  modalView: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  }
})



export default singleinput;
