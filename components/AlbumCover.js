import { View,  StyleSheet, Image } from 'react-native';
import React from 'react';


const albumcover = (props) => {
  const [ $event, $setEvent] = React.useState({});

  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={[styles.container, styles.shadow]}>
      <View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          maxHeight: 100,
          marginTop: 10,
        }}>
          <Image
            style={styles.image}
            source={'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'}
          ></Image>
        </View>
      </View>
    </View>  )
}

let styles = StyleSheet.create({
  container:{
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: 'white',
    height: 100,
    width: 100,
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
