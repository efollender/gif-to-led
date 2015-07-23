// Lets require/import the HTTP module
// var http = require('http');

// var SlackAlert = require('./src/js/SlackAlert');
//   var alert = new SlackAlert(2);
//   alert.start();
  
//var AudioParser = require('./src/js/audioParser');

//var parser = new AudioParser();

// parser.init('./src/audio/boss.mp3');

// var SpotifyViewer = require('./src/js/spotifyData.js');

// var Spotify = new SpotifyViewer;

// Spotify.init();

var python = require('python-shell');

python.run('../Adafruit_Python_MPR121/examples/simpletest.py', function (err, results) {
  if (err) throw err;
  if (results) console.log(results);
  console.log('finished');
});
