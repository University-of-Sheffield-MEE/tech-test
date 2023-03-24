// NOTICE!
// This file is not relevant to your interview
// You will not be required to understand or edit this file
// You may safely ignore it

const peer = new Peer();

const previousUrl = localStorage.getItem('server-url');
const previousPeerId = localStorage.getItem('peer-id');

if (previousUrl) {
  document.querySelector('#server-url').value = previousUrl;
}
if (previousPeerId) {
  document.querySelector('#peer-id').value = previousPeerId;
}

// Connect to remote peer and receive its video stream
function connect() {
  const peerId = document.querySelector('#peer-id').value;
  const serverUrl = document.querySelector('#server-url').value;

  localStorage.setItem('server-url', serverUrl);
  localStorage.setItem('peer-id', peerId);

  document.getElementById('video-container').classList.remove('d-none');

  if (!peerId) {
    return;
  }

  document.getElementById('video-not-available').classList.add('d-none');

  const call = peer.call(peerId, createMediaStreamFake());

  call.on('stream', (stream) => {
    console.log('Got remote stream from ' + call.peer);
    document.getElementById('remote-video').srcObject = stream;
  });

  call.on('error', (error) => {
    console.error(error);
    setErrorMessage('Failed to make video stream connection. See console');
    document.getElementById('video-not-available').classList.remove('d-none');
  });

  call.on('close', () => {
    console.log('Connection closed');
    document.getElementById('video-not-available').classList.remove('d-none');
  });
}

document.getElementById('connect').addEventListener('click', connect);


// Hackiness to avoid sending real video/audio (peerJS requires you to send _something_)
const createMediaStreamFake = () => {
  return new MediaStream([createEmptyAudioTrack(), createEmptyVideoTrack({ width: 640, height: 480 })]);
}
const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
}
const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  canvas.getContext('2d').fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};