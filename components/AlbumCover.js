import { View,  StyleSheet, Image , StatusBar, Animated} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const albumcover = (props) => {
  const [ event, setEvent] = React.useState({});

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

  return (
    <View style={[styles.container, styles.shadow]}>
          <Image
            style={[styles.image]}
            source={{uri: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'}}
          ></Image>
    </View>
    )
}

let styles = StyleSheet.create({
  container:{
    // borderWidth: 1,
    // borderColor: "red",
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: '50%',
    height: 250,
    width: 250,
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
