import { View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable } from 'react-native';
import react ,{useState, useRef}from 'react';



const codemodal = (props) => {
  const CODE_LENGTH = 4;
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
      <View key={idx}> 
        <Text style={[styles.input, { borderWidth: 1, borderColor: '#9ea9ba'}]} >{digit}</Text>
      </View>
    );
  };

  return (
    <View  style={[styles.container, styles.shadow]}>
      <View >
        <Text style={[styles.label]}>{props.topLabel}</Text>
      </View>
        <View> 
        <Pressable style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          maxHeight: 100,
          marginTop: 10,
        }} onPress={focusHiddenInput}>
            {codeDigitsArray.map(toDigitInput)}
          </Pressable>
        <TextInput
          ref={ref}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          returnKeyType="done"
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
    margin: 12,
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
