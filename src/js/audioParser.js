var 	fs = require('fs'),
		lame = require('lame'),
		Canvas  = require('canvas'),
    	Adafruit = require('node-rpi-rgb-led-matrix/main');
var fakeData = [135,
     12,
     76,
     224,
     49,
     192,
     112,
     81,
     24,
     65,
     99,
     205,
     57,
     162,
     152,
     117,
     209,
     210,
     243,
     12,
     1,
     8,
     46,
     97,
     73,
     154,
     2,
     67,
     80,
     204,
     73,
     244,
     201,
     7,
     12,
     125,
     214,
     191,
     90,
     243,
     138,
     201,
     91,
     131,
     96,
     77,
     204,
     131,
     140,
     50,
     5,
     135,
     12,
     76,
     224,
     49,
     192,
     112,
     81,
     24,
     65,
     99,
     205,
     57,
     162,
     152,
     117,
     209,
     210,
     243,
     12,
     1,
     8,
     46,
     97,
     73,
     154,
     2,
     67,
     80,
     204,
     73,
     244,
     201];

var AudioParser = function(boards){

	if(!boards) boards = 1;

	var board = {
	    height: 32,
	    width: 32*boards
	  },
	  intervalSet = false,
	  canvas = new Canvas(board.width, board.height),
	  ctx = canvas.getContext('2d');

	//TODO: Open filestream and read chunks as they're processed. Output buffer
	this.streamAudio = function(file, cb){
		var me = this;
		var audioStream = fs.createReadStream(file);
		var bufs = [];
		audioStream.on('data', function(data){
			var jsonified = data.toJSON();
			console.log(jsonified)
			for (var i in jsonified.data){
				bufs.push(jsonified.data[i]);
			}

		});
		audioStream.on('end', function(data){
			//Send buffer to callback...Does it need to be a buffer?
			me.drawToCanvas(bufs);
			cb(bufs);
		});
		audioStream.on('error', function(err){
			console.log('stream error', err);
		});
	},
	//TODO: get raw data from mp3
	this.decodeMP3 = function(mp3){
		//pseudo coding
		lame.Decoder(mp3);
	},
	// TODO: Normalize buffer json
	this.normalizeData = function(bufferData){
		// var ratio = Math.max(...bufferData) / 32;

		// bufferData = bufferData.map(v => Math.round(v / ratio));
		// console.log('normalized',bufferData);
	},
	//TODO: Convert each audio frame to canvas image
	this.drawToCanvas = function(pixels){
	    	var waveform = setInterval(function(){
	    		var newPixels = pixels;
		    	for(var i in newPixels){
			    	newPixels[i] = newPixels[i]%32;
	    			while(newPixels[i] > 0){
	    				console.log('reducing', newPixels[i])
		    			intervalSet = true;
		    			newPixels[i]--;
		    			//Waveform
		    			Adafruit.setPixel(i, board.height/2 - newPixels[i]/2, 255, 0,0);
		    			Adafruit.setPixel(i, board.height/2 + newPixels[i]/2, 255, 0,0);

	    			}
		    	}
		    	var newPixels = pixels;
		    }, 1);
		   setTimeout(function(){
		   	Adafruit.clear();
		   	clearInterval(waveform);
		   }, 4000);
	},
	//TODO: Send each canvas drawing to matrix
	this.sendToMatrix = function(canvasDrawing){

	},
	//TODO: parser flow
	this.init = function(file){
		var me = this;
		Adafruit.start(board.height, boards, false);
		this.drawToCanvas(fakeData);
		// this.streamAudio(file, function(data){
		// 	// me.normalizeData(data.data);
		// 	// this.decodeMP3(data)
		// 	// let interpretation = this.interpretData(data);
		// 	// this.sendToMatrix(drawToCanvas(interpretation));
		// 	console.log(data);
		// });

	}
}

module.exports = AudioParser;
