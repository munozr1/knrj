import * as React from "react";
import { BlurView } from "expo-blur"
import { Text , View, StyleSheet, Animated} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);


const menu = (props) => {
  const value = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(value.current, { toValue: 100, duration: 200, useNativeDriver: false}).start();
  }, []);

  const fadeOut = () =>{
    Animated.timing(value.current, {
        toValue: 0, 
        duration: 200,
        useNativeDriver: false
    }).start();
  }

  const leave = async () => {
    fadeOut();
    setTimeout(() => {
      props.leave();
    }, 200);
    //TODO if host remove event from firebase
  }
  const logout = async () => {
    fadeOut();
    setTimeout(() => {
      props.logout();
    }, 200);
  }
  const exit = async () => {
    fadeOut();
    setTimeout(() => {
      props.exit();
    }, 200);
  }

  return (
    <AnimatedBlurView
      style={[styles.container, StyleSheet.absoluteFill, styles.nonBlurredContent]}
    intensity={value.current}
    opa
    >
      <TouchableOpacity
      onPress={()=>{leave()}}
      >
        <Text style={[styles.label, {color: 'red'}]}>Leave Event</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => {logout()}}
      >
        <Text style={[styles.label, {color:'red'}]}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={{
        marginTop: 0
      }}
      onPress={()=> {exit()}}
      >
        <Text style={[styles.label]}>{'Back'}</Text>
      </TouchableOpacity>
    </AnimatedBlurView>
  )
}


let styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    textAlign: "center",
    padding: "3%",
    fontWeight: '800',
  },
  blurredImage: {
    width: 192,
    height: 192,
  },
  nonBlurredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

})


export default menu
