// Lets require/import the HTTP module
// var http = require('http');

// var SlackAlert = require('./src/js/SlackAlert');
//   var alert = new SlackAlert(2);
//   alert.start();
  
var AudioParser = require('./src/js/audioParser');

var parser = new AudioParser();

// parser.init('./src/audio/boss.mp3');

// var SpotifyViewer = require('./src/js/spotifyData.js');

// var Spotify = new SpotifyViewer;

// Spotify.init();

var MPR121 = require('Node_MPR121');

var touchsensor = new MPR121(0x5A, 1);

if (touchsensor.begin()) {
    // message how to quit
    console.log('Press Ctrl-C to quit.');

    // Interval for reading the sonsor
    setInterval(function() {
        // get touch values
        var t = touchsensor.touched();
        if(t == 2) { parser.init('./src/audio/boss.mp3');}
        // prepare some result array
        var ret = [];

        // loop through pins
        for (var i = 0; i < 9; i++) {
            // push status into array
            ret.push (touchsensor.is_touched(i));
        }

        console.log(ret);

    },100);
};