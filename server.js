// Lets require/import the HTTP module
// var http = require('http');

// var SlackAlert = require('./src/js/SlackAlert');
//   var alert = new SlackAlert(2);
//   alert.start();
  
// var AudioParser = require('./src/js/audioParser');

// var parser = new AudioParser(2);

// parser.init('./src/audio/boss.mp3');

var SpotifyViewer = require('./src/js/spotifyData.js');

var Spotify = new SpotifyViewer;

Spotify.init();