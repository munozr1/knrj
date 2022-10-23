import { View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable, Keyboard} from 'react-native';
import {useState, useRef}from 'react';



const codemodal = (props) => {
  const CODE_LENGTH = props.length || 6;
  const [code, setCode] = useState('');
  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);
  const ref = useRef();

  const focusHiddenInput= () => {
    console.log('focusing hidden input...');
    ref?.current?.focus();
  };

  const toDigitInput = (_value, idx) => {
    const emptyInputChar = ' ';
    const digit = code[idx] || emptyInputChar;
    return (
      <View key={idx} style={{marginTop: 0}}> 
        <Text style={[styles.input, { borderWidth: 1, borderColor: '#9ea9ba'}]} >{digit}</Text>
      </View>
    );
  };

  return (
    <View  style={[styles.container, styles.shadow]}>
      <View >
        <Text style={[styles.label]}>{props.topLabel}</Text>
      </View>
      {
        (props.secondLabel) ?
        <View style={{ alignItems: 'center'}}>
          <TouchableOpacity onPress={() => { props.secondAction() }}
            style={[{
              width: 150,
            }]}
          >
            <Text style={styles.secondLabel}>{props.secondLabel}</Text>
          </TouchableOpacity>
          </View>
          : null
      }
        <View> 
          
        <Pressable style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          maxHeight: 100,
          marginTop: 0,
        }} onPress={focusHiddenInput}>
            {codeDigitsArray.map(toDigitInput)}
          </Pressable>
        <TextInput
          ref={ref}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={CODE_LENGTH}
          style={styles.hiddenCodeInput}
        />
        </View> 
        <TouchableOpacity onPress={()=>{props.verify(code)}} style={styles.botLabel}>
          <Text style={styles.label}>{props.botLabel}</Text>
        </TouchableOpacity>
    </View>
  )
}


let styles = StyleSheet.create({
  input:{
    padding:15,
    height: 80,
    marginTop: 12,
    marginBottom:12,
    marginLeft: 5,
    marginRight: 5,
    width: 55,
    textAlign: 'center',
    fontSize:35 ,
    borderRadius: 15,
  },
  shadow:{
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 1/3,
    elevation: 1,
    backgroundColor: "white", // invisible color
  }
  ,
  container:{
    backgroundColor: "white",
    borderRadius: 37,
    height: 250,
  },
  label: {
      textAlign: "center",
      padding: "3%",
      fontWeight: '800'
    },
  secondLabel: {
      textAlign: "center",
      padding: "3%",
      fontWeight: '500',
      // color: 'grey',
      opacity: 0.2
    },
  optionalLable:{
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
})



export default codemodal;
