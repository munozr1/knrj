import * as React from "react";
import { ResponseType, useAuthRequest } from 'expo-auth-session';

const PLAY = 'https://api.spotify.com/v1/me/player/play';
const PAUSE = 'https://api.spotify.com/v1/me/player/pause';
const NEXT = 'https://api.spotify.com/v1/me/player/next';
const PREVIOUS = 'https://api.spotify.com/v1/me/player/previous';
const CURRENTLY_PLAYING = 'https://api.spotify.com/v1/me/player/currently-playing';

const SEARCH = 'https://api.spotify.com/v1/search';
const IMAGE = {
  "album": {
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/0rJ0xlAQI0wLRucDRoQQbO"
        },
        "href": "https://api.spotify.com/v1/artists/0rJ0xlAQI0wLRucDRoQQbO",
        "id": "0rJ0xlAQI0wLRucDRoQQbO",
        "name": "Artist Name",
        "type": "artist",
        "uri": "spotify:artist:0rJ0xlAQI0wLRucDRoQQbO"
      }
    ],
    "href": "https://api.spotify.com/v1/albums/2tyKrUxYAexhkXrL5TAxq3",
    "id": "2tyKrUxYAexhkXrL5TAxq3",
    "images": [
      {
        "height": 640,
        "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
        "width": 640
      }
    ],
    "name": "Track Name",
    "release_date": "2017-03-17",
    "release_date_precision": "day",
    "total_tracks": 20,
    "type": "album",
    "uri": "spotify:album:2tyKrUxYAexhkXrL5TAxq3"
  }

}


const SpotifyContext = React.createContext();
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SpotifyProvider = ({ children }) => {

  const [backgroundImage, setBackgroundImage] =React.useState('https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [$spotifyState, $setSpotifyState] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [song, setSong] = React.useState(IMAGE);
  const [duration, setDuration] = React.useState(0);
  const [progressMs, setProgressMs] = React.useState(0);
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
      // redirectUri: 'https://google.com'
      // redirectUri: 'https://munozcodes.com/.well-known/apple-app-site-association'
      // redirectUri: 'https://www.munozcodes.com',
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      $setSpotifyState(true);
      setToken(access_token);
      setDone(true);
      setModalVisible(false);
      console.log('Token - ' + access_token);

      if (access_token) {
        currentlyPlaying();
      }
    }
  }, [response]);


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
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(handleApiResponse);
    setTimeout(async () => {
      await currentlyPlaying()
    }, 200);

  }

  const enqueue = async (song) => {
    //TODO add song to host queue
  }
  
  const dequeue = async (song) => {
    //TODO remove song from host queue
  }

  const search = async (term) => {
    console.log('SpotifyProvider => search()')
    console.log('\nSearching for ' + term);

    await fetch(SEARCH + "?q=" + encodeURI(term) + "&type=track&limit=5", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => { return data.tracks.items })
  }

  const currentlyPlaying = async() => {
    await fetch(CURRENTLY_PLAYING, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => response.json()).then((response) => {
      console.log('response =-=-=>',response.progress_ms);
      fetchNewSong(response.progress_ms, response.item.duration_ms)
      setBackgroundImage(response.item.album.images[0].url);
      setSong(response.item)
    }).catch(e=>{
      console.log('Error SpotifyProvider() => currentlyPlaying()')
      console.log(e);
    })
  }

  const fetchNewSong = (current_ms, duration_ms) => {
    setDuration(duration_ms);
    setProgressMs(current_ms);
    setTimeout(async () => {
      console.log('SpotifyProvider() => fetchNewSong()')
      await currentlyPlaying()
    }, (duration_ms - current_ms)+100);
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
        modalVisible,
        backgroundImage,
        setBackgroundImage,
        song,
        setSong,
        progressMs,
        duration,
        setProgressMs,
        setDuration
      }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export { SpotifyContext, SpotifyProvider, IMAGE };
