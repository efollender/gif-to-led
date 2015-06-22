"use strict";

const parser = require('gify-parse');
const pixels = require('get-pixels');
const canvasTo32 = require('rpi-ws281x-canvas');
const async = require('async');
const fs = require('fs');

let canvas = canvasTo32.create(32,32);
let ctx = canvas.getContext('2d');
let Image = canvasTo32.Image;

let FPS = 10;

//TODO: Method to get gif from stream. Use Axios?
// let IMAGE_ARRAY = ?

function loadImage(image, cb){
	pixels(image, function(err, pix){
		if(err){
			return err;
		}
		return pix;
	});
}

function returnGif(image){
	let loadedImage = loadImage(image);
	let info = gifyParse.getInfo(loadedImage);
	if(info.valid){
		return {
			height: info.height,
			width: info.width,
			images: info.images,
			duration: info.duration
		}
	} else {
		return {
			error: 'Invalid gif'
		}
	}
}

function loadImages(imageArray, callback) {
    

    async.mapLimit(imageArray, 10, getPixels, function(err, fileBuffers) {
        if(err) { return callback(err); }

        var images = fileBuffers.map(function(buf) {
            var img = new Image();
            img.src = buf;

            return img;
        });

        callback(null, images);
    });
}

function startRendering(images) {
    var idx = 0,
        ctx = canvas.getContext('2d');

    ws281x.init(100);
    ws281x.setIndexMapping(ws281x.indexMapping.mirrorMatrixX(32,32));

    setInterval(function() {
        ctx.drawImage(images[idx], 0,0,32,32);
        ws281x.render(canvas.toUint32Array());

        idx = (idx+1)%images.length;
    }, 1000/FPS);
}

loadImages(IMAGE_ARRAY, function(err, images) {
    startRendering(images)
});