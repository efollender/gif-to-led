//Lets require/import the HTTP module
// var http = require('http');
var ws281x = require('rpi-ws281x-native'),
    canvas = require('rpi-ws281x-canvas').create(32,32),
    ctx = canvas.getContext('2d');

// //Lets define a port we want to listen to
// const PORT=8080; 

// //We need a function which handles requests and send response
// function handleRequest(request, response){
//     response.end('It Works!! Path Hit: ' + request.url);
// }

// //Create a server
// var server = http.createServer(handleRequest);

// //Lets start our server
// server.listen(PORT, function(){
//     //Callback triggered when server is successfully listening. Hurray!
//     console.log("Server listening on: http://localhost:%s", PORT);
// });

ws281x.init(100);

ctx.fillStyle = 'blue';
ctx.fillRect(2, 2, 8, 8);

ws281x.render(canvas.toUint32Array());