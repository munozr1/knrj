




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
  if (album.length > 0) {
    body.context_uri = album;
  }
  else {
    body.context_uri = 'spotify:playlist:' + playlist_id;
  }
  body.offset = {};
  body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
  body.offset.position_ms = 0;
  requestApi('PUT', PLAY + '?device_id=' + deviceId(), JSON.stringify(body), handleApiResponse);
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
  if (this.status == 200) {
    console.log(this.responseText);
    setTimeout(currentlyPlaying, 2000);
  }
  else if (this.status == 204) {
    setTimeout(currentlyPlaying, 2000);
  }
  else if (this.status == 401) {
    refreshAccessToken()
  }
  else {
    console.log(this.responseText);
    alert(this.responseText);
  }
}

function handleCurrentlyPlayingResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);
    if (data.item != null) {
      document.getElementById('albumImage').src = data.item.album.images[0].url;
      document.getElementById('trackTitle').innerHTML = data.item.name;
      document.getElementById('trackArtist').innerHTML = data.item.artists[0].name;
    }


    if (data.device != null) {
      // select device
      currentDevice = data.device.id;
      document.getElementById('devices').value = currentDevice;
    }

    if (data.context != null) {
      // select playlist
      currentPlaylist = data.context.uri;
      currentPlaylist = currentPlaylist.substring(currentPlaylist.lastIndexOf(":") + 1, currentPlaylist.length);
      document.getElementById('playlists').value = currentPlaylist;
    }
  }
  else if (this.status == 204) {

  }
  else if (this.status == 401) {
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
