const parser = require('gify-parse');
const pixels = require('get-pixels');

loadImage(image, cb){
	pixels(image, function(err, pix){
		if(err){
			return err;
		}
		return pix;
	});
}

returnGif(image){
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