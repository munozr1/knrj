import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import { useEffect, useState } from 'react';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const PLAY = 'https://api.spotify.com/v1/me/player/play';
const PAUSE = 'https://api.spotify.com/v1/me/player/pause';
const NEXT = 'https://api.spotify.com/v1/me/player/next';
const PREVIOUS = 'https://api.spotify.com/v1/me/player/previous';
const CURRENTLY_PLAYING = 'https://api.spotify.com/v1/me/player/currently-playing';

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
      redirectUri: 'exp://192.168.1.146:19000'
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);

      console.log('Token - ' + access_token);
      console.log('Device ID - ' + deviceId)
    }
  }, [response]);

  function requestApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.send(body);
  
    xhr.onload = callback;
  }

  function play() {
    let playlist_id = document.getElementById('playlists').value;
    let trackindex = document.getElementById('tracks').value;
    let album = document.getElementById('album').value;
    let body = {};
    if ( album.length > 0 ){
        body.context_uri = album;
    }
    else{
        body.context_uri = 'spotify:playlist:' + playlist_id;
    }
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    requestApi('PUT', PLAY + '?device_id=' + deviceId(), JSON.stringify(body), handleApiResponse );
  }
  
  function pause() {
    requestApi('POST', PAUSE + '?device_id=' + deviceId(), null, handleApiResponse);
  }
  
  function next() {
    requestApi('POST', NEXT + '?device_id=' + deviceId(), null, handleApiResponse);
  }
  
  function previous() {
    requestApi('POST', PREVIOUS + '?device_id=' + deviceId(), null, handleApiResponse);
  }
  
  function currentlyPlaying() {
    requestApi('GET', PLAYER + '?market=US', null, handleCurrentlyPlayingResponse);
  }
  
  function handleApiResponse() {
    if ( this.status == 200) {
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 204 ) {
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 401 ) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
  }
  
  function handleCurrentlyPlayingResponse(){
    if (this.status == 200 ) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.item != null ) {
            document.getElementById('albumImage').src = data.item.album.images[0].url;
            document.getElementById('trackTitle').innerHTML = data.item.name;
            document.getElementById('trackArtist').innerHTML = data.item.artists[0].name;
        }
  
  
        if ( data.device != null ) {
            // select device
            currentDevice = data.device.id;
            document.getElementById('devices').value=currentDevice;
        }
  
        if ( data.context != null ) {
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            document.getElementById('playlists').value=currentPlaylist;
        }
    }
    else if ( this.status == 204 ) {
  
    }
    else if ( this.status == 401 ) {
        refreshAccessToken()
    }
    else {
        console.log(responseText);
        alert(responseText);
    }
  }
  
  function deviceId() {
    return document.getElementById('devices').value;
  }

  return (
    <View style={[styles.container, styles.shadow]}>
        <View>
          <TouchableOpacity onPress={() => { props.back() }}
            style={[{
              width: 150,
              marginBottom: 1
            }]}
          >
            <Text style={styles.secondLabel}>{'Join Instead'}</Text>
          </TouchableOpacity>
        </View>
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
  secondLabel: {
    textAlign: "center",
    padding: "3%",
    fontWeight: '500',
    // color: 'grey',
    opacity: 0.2,
  },
})


export default spotifylogin
