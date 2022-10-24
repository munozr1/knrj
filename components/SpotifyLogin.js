import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import { useEffect, useState } from 'react';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const spotifylogin = (props) => {
  const [token, setToken] = useState("");
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '67e4ad90bc6e4bec9eb4e4648117d547',
      scopes: [
        'user-read-currently-playing',
        'user-read-recently-played',
        'user-read-playback-state',
        'user-top-read',
        'user-modify-playback-state',
        'streaming',
        'user-read-email',
        'user-read-private',
      ],
      usePKCE: false,
      redirectUri: 'exp://192.168.1.101:19000'
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  return (
    <View style={[styles.container, styles.shadow]}>
        <TouchableOpacity style={{ width: 170 }} onPress={() => { promptAsync(); }}>
          <Text style={styles.label}>{props.label}</Text>
        </TouchableOpacity>
    </View>
  )
}

let styles = StyleSheet.create({
    input:{
        padding:15,
        height: 60,
        margin: 12,
        width: 300,
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
      },
      container:{
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
})


export default spotifylogin
