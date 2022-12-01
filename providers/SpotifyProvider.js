import * as React from "react";
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import { DBContext } from "./FirestoreProvider";

const PLAY = 'https://api.spotify.com/v1/me/player/play';
const PAUSE = 'https://api.spotify.com/v1/me/player/pause';
const NEXT = 'https://api.spotify.com/v1/me/player/next';
const PREVIOUS = 'https://api.spotify.com/v1/me/player/previous';
const CURRENTLY_PLAYING = 'https://api.spotify.com/v1/me/player/currently-playing';
const SEARCH = 'https://api.spotify.com/v1/search';
const GET_TRACK = 'http://api.spotify.com/v1/tracks';

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

  const {
    updateCurrentPlayingSong
  } = React.useContext(DBContext);

  const [backgroundImage, setBackgroundImage] = React.useState('https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228');
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
        'user-modify-playback-state',
        'user-top-read',
        'streaming',
        'user-read-email',
        'user-read-private',
      ],
      usePKCE: false,
      redirectUri: 'exp://172.20.10.2:19000'
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

      setTimeout(async () => {
        await currentlyPlaying();
      }, 500);
    }
  }, [response]);

  const handleApiResponse = (resp) => {
    /*
    console.log('handleApiResponse()=> resp: ',resp)
    const response = JSON.stringify(resp);
    switch(resp.status) {
    case 200: 
      // console.log(resp.responseText);
      console.log('200: ', response)
      // await setTimeout(currentlyPlaying, 2000);
      break;
    default:
      console.log(response);
      // alert(resp.responseText);
    }
    */
  }

  const pause = async () => {
    const res = await fetch(PAUSE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
  }

  const resumePlay = async () => {
    const res = await fetch(PLAY, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      "position_ms": 0,
    });
  }

  const play = async (song_id) => {
    console.log('SpotifyProvider: play()');
    const res = await fetch(PLAY, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: JSON.stringify({
        "uri": [encodeURI("spotify:track:" + song_id)],
        "position_ms": 0,
      }),
    });
    const json = await res.json();
    return json;
  }

  const enqueue = async (song) => {
    //TODO add song to host queue
  }

  const dequeue = async (song) => {
    //TODO remove song from host queue
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

  const search = async (term) => {
    console.log('SpotifyProvider => search()')
    console.log('Searching for ' + term);

    const res = await fetch(SEARCH + "?q=" + encodeURI(term) + "&type=track&limit=5", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    const json = await res.json();
    return json;
  }

  const currentlyPlaying = async () => {
    await fetch(CURRENTLY_PLAYING, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => response.json()).then((response) => {
      //console.log('response =-=-=>',response.progress_ms);
      fetchNewSong(response.progress_ms, response.item.duration_ms)
      setBackgroundImage(response.item.album.images[0].url);
      setSong(response.item)

      updateCurrentPlayingSong(response.item.uri);
      console.log(response.item.uri);
    }).catch(e => {
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
    }, (duration_ms - current_ms) + 100);
  }

  const getTrack = async (track_id) => {
    const res = await fetch(GET_TRACK + track_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    const json = await res.json();
    return json;
  }

  return (
    // the Provider gives access to the context to its children
    <SpotifyContext.Provider
      value={{
        play,
        resumePlay,
        pause,
        skip,
        search,
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
        setDuration,
        getTrack
      }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export { SpotifyContext, SpotifyProvider, IMAGE };
