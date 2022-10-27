import React from "react";
import { ResponseType, useAuthRequest } from 'expo-auth-session';

const PLAY = 'https://api.spotify.com/v1/me/player/play';
const PAUSE = 'https://api.spotify.com/v1/me/player/pause';
const NEXT = 'https://api.spotify.com/v1/me/player/next';
const PREVIOUS = 'https://api.spotify.com/v1/me/player/previous';
const CURRENTLY_PLAYING = 'https://api.spotify.com/v1/me/player/currently-playing';

const SpotifyContext = React.createContext();
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SpotifyProvider = ({ children }) => {

  const [modalVisible, setModalVisible] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [$spotifyState, $setSpotifyState] = React.useState({});
  const [token, setToken] = React.useState("");
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


  const handleApiResponse = (resp) => {
    // console.log('handleApiResponse()=> resp: ',resp)
    let response = JSON.stringify(resp);
    switch(resp.status)
    {
    case 200: 
      // console.log(resp.responseText);
      console.log('200: ', response)
      // await setTimeout(currentlyPlaying, 2000);
      break;
    case 204: 
      // await setTimeout(currentlyPlaying, 2000);
      console.log('204: ', response)
      break;
    case 401: 
      console.log('401: ', response)
      // await refreshAccessToken()
      break;
    case 405: 
      console.log('405: ', response)
      // await refreshAccessToken()
      break;
    case 404:
        console.log('404: ', response)
        // await refreshAccessToken()
        break;
    default:
      console.log(response);
      // alert(resp.responseText);
    }
  }

  const play = async (token, song) => {
    await fetch(PLAY, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/josn',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
          "position_ms": 0,
          "context_uri": song
      })
    }).then(handleApiResponse).catch((e)=>{
      //TODO handle error
      console.log(e);
      throw new Error(e);
    })
  }

  const skip = async () => {

    console.log('SpotifyProvider => skip()')
    await fetch(NEXT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/josn',
        'Authorization': 'Bearer ' + token
      }
    }).then(handleApiResponse)
  }

    React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);
      setDone(true);
      setModalVisible(false);
      console.log('Token - ' + access_token);
      // console.log('Device ID - ' + deviceId)
    }
  }, [response]);

  const enqueue = (song) => {
    //TODO add song to host queue
  }
  
  const dequeue = (song) => {
    //TODO remove song from host queue
  }

  const search = async (term) => {
    //TODO search spotify for term
  }

  

  return (
    // the Provider gives access to the context to its children
    <SpotifyContext.Provider
      value={{
        play,
        skip,
        token,
        promptAsync,
        $spotifyState,
        $setSpotifyState,
        done,
        setDone,
        setModalVisible,
        modalVisible
      }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export { SpotifyContext, SpotifyProvider };
