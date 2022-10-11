import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import react from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const codemodal = ({ navigation , topLabel, botLabel} ) => {
  return (
    <View  style={[styles.container, styles.shadow]}>
      <View >
        <Text style={[styles.label]}>{topLabel}</Text>
      </View>
        <View style={{
          flex:1,
          flexDirection: 'row',
          justifyContent: 'center',
          maxHeight: 100,
          marginTop: 10
          }}> 
          <TextInput keyboardType='number-pad' enablesReturnKeyAutomatically maxLength={1} style={[styles.shadow, styles.input]}></TextInput>
          <TextInput maxLength={1} style={[styles.shadow, styles.input]}></TextInput>
          <TextInput maxLength={1} style={[styles.shadow, styles.input]}></TextInput>
          <TextInput maxLength={1} style={[styles.shadow, styles.input]}></TextInput>
        </View> 
      <View >
        <TouchableOpacity onPress={()=>{console.log('bot label pressed')}}>
          <Text style={[styles.label, styles.botLabel]}>{botLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


let styles = StyleSheet.create({
  input:{
    // borderWidth: 1,
    padding:15,
    height: 80,
    margin: 12,
    width: 55,
    textAlign: 'center',
    fontSize:35 ,
    borderRadius: 15
  },
  shadow:{
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 1/3,
    elevation: 1,
    // background color must be set
    backgroundColor: "white" // invisible color
  }
  ,
  container:{
    backgroundColor: "white",
    borderRadius: 37,
    height: 250
  },
  label: {
      textAlign: "center",
      padding: "3%",
      fontWeight: '800'
    },
  botLabel: {
    marginTop: 10
  }
})



export default codemodal;
