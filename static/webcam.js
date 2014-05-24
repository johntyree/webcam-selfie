navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// THINGS WHICH WILL NEVER CHANGE
var constraints = {audio: true, video: true};
var video = document.querySelector('video');
var download_link = document.getElementById('download-link');
// var canvas = document.querySelector('canvas');
// var ctx = canvas.getContext('2d');
var toggleRecordingBtn = document.getElementById('toggle-recording');


// THINGS WHICH CHANGE FOR EACH RECORDING
var localMediaStream = null;
var audioVideoRecorder = null;

function recoverBlob(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'blob';
    req.onload = function(e) {
        callback(req.response);
    };
    req.send();
}

// BUTTON SHIT
toggleRecordingBtn.onclick = function() {
    if (localMediaStream) {
        stopRecording();
    } else {
        startRecording();
    }
};

function startRecording() {
    function successCallback(stream) {
        localMediaStream = stream; // stream available to console
        audioVideoRecorder = window.RecordRTC(stream);
        audioVideoRecorder.startRecording();
        video.src = window.URL.createObjectURL(stream);
        toggleRecordingBtn.textContent = 'Stop Recording';
    }
    function errorCallback(error) {
        console.error('navigator.getUserMedia error: ', error);
    }
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}

function stopRecording() {
    localMediaStream.stop();
    localMediaStream = null;
    audioVideoRecorder.stopRecording(function(url) {
        video.src = url;
        recoverBlob(url, function(blob) {
            var form = new FormData();
            form.append('blob', blob);
            var req = new XMLHttpRequest();
            req.open('POST', '/upload', true);
            req.onload = function() {
                console.log(this.responseText);
                download_link.href = this.responseText;
                download_link.style.visibility = '';
            };
            req.send(form);
        });
    });
    toggleRecordingBtn.textContent = 'Start Recording';
}
