//Lets require/import the HTTP module
var http = require('http');
var ws281x = require('rpi-ws281x-native'),
    canvas = require('rpi-ws281x-canvas').create(32,32),
    ctx = canvas.getContext('2d');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

function rnd(max) { return (max || 1) * Math.random(); }
function rndi(max) { return Math.round(rnd(max)); }

ws281x.init(100);

setInterval(function() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#' + rndi(0xffffff).toString(16);
    ctx.fillRect(rndi(10)-2, rndi(10)-2, rndi(10), rndi(10));

    ws281x.render(canvas.toUint32Array());
}, 100);