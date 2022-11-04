import { PanResponder,Text, View,  StyleSheet, Image , StatusBar, Animated, TouchableOpacity, Vibration, TouchableHighlight, Modal, ImageBackground} from 'react-native';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Menu from './Menu'



const albumcover = (props) => {
  const [ event, setEvent] = React.useState({});
  const [showMenu, setShowMenu] = React.useState(false);

  let state = {
    opacity: new Animated.Value(0),
  }
  let fadeIn = () => {
    Animated.timing(state.opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  const logout = () => {
    console.log('loging out')
    setShowMenu(false);
    props.resetAuth();
  }
  const leaveEvent = () =>{
    console.log('leaving event')
    setShowMenu(false);
    props.resetEvent();
  }
  const shortPress = () =>{
    console.log("Short")
  }

  

  const menu = ()=> {
    console.log('long pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowMenu(!showMenu);
  }

  

  return (
    <View style={[styles.container, styles.shadow]}>
      <ImageBackground
        source={{ uri: props.bgImage }}
        style={{
          height: '100%',
          width: '100%'
        }}
      >
      {
        (!showMenu) ? 
        <TouchableOpacity
          onLongPress={menu}
          onPress={shortPress}
          // activeOpacity={.9}
          // underlayColor="#DDDDDD"

        >
          <Image
            style={[styles.image]}
            // source={{ uri: props.bgImage }}
          >
          </Image>
        </TouchableOpacity>
        :null
      }
      {
        (showMenu) ? 
        <Menu
        logout={logout}
        leave={leaveEvent}
        exit={menu}
        // setMenu={setShowMenu} 
        ></Menu>
        :null
      }
      </ImageBackground>
    </View>
    // </View>
    )
}

let styles = StyleSheet.create({
  container:{
    // borderWidth: 1,
    // borderColor: "red",
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: '50%',
    height: 370,
    width: 370,
  },
  shadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 1 / 3,
    elevation: 1,
    backgroundColor: "white", // invisible color
  },
  image: {
    height: '100%',
    width: '100%',
    
  }

})

export default albumcover;
