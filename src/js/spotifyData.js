var Envs = require('../../envs_config.json');
var Firebase = require('firebase');
var FirebaseRef = new Firebase(Envs.FIREBASE_URL);
var Canvas  = require('canvas'),
    Adafruit = require('node-rpi-rgb-led-matrix/main');
var board = {
	width: 64,
	height: 32,
	chains: 2
	},
	canvas = new Canvas(board.width, board.height),
	ctx = canvas.getContext('2d'),
	i = 0,
	frequency = .1;

Adafruit.start(board.height, board.chains, true);

var SpotifyDataViewer = function(){
	this.colors = {
		   red: function(){
		   	return Math.floor(Math.sin( frequency*i + 0) * 127 + 128)
		   },
		   green: function(){
		   	return Math.floor(Math.sin(frequency*i + 2) * 127 + 128)
		   },
		   blue: function(){
		   	return Math.floor(Math.sin(frequency*i + 4) * 127 + 128)
		   },
		};
	this.drawToCanvas = function(drawing){
		if(i < 64){
			i++; 
		}else {
			i = 0;
		} 
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,board.width, board.height);
		ctx.fillStyle = 'rgb('+this.colors.red()+','+this.colors.green()+','+this.colors.blue()+')';
		ctx.font = '8px verdana';
		ctx.fillText(drawing, 3, 10);
		Adafruit.drawCanvas(ctx, board.width, board.height);
	};
	this.getCurrentTrack = function(){
		var me = this;
		FirebaseRef.child("current").on('value', function(snapshot){
			var track = snapshot.val(),
				minutes = Math.floor(track.currentSecond/60),
				seconds = track.currentSecond - (minutes*60);
		    	seconds = (seconds < 10 ? '0' : '') + seconds;
				time = minutes.toString() + ':' + seconds.toString();
			me.drawToCanvas(track.name + '\n' + track.artist + '\n' + time);
		});
	};
	this.init = function(){
		this.getCurrentTrack();
	};
};

module.exports = SpotifyDataViewer;