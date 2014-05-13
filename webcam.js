navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {audio: false, video: true};
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;

function snapshot() {
    if (localMediaStream) {
        ctx.drawImage(video, 0, 0, 640, 480, 0, 0, 640, 480);
        document.querySelector('img').src = canvas.toDataURL('image/png');
    }
}

video.addEventListener('click', snapshot, false);

function successCallback(stream) {
  localMediaStream = stream; // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
}

function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
}

function grabStream() {
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}

grabStream();
