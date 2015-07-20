const axios = require('axios'),
    Canvas = require('canvas'),
    Image = Canvas.Image,
    WebSocket = require('ws'),
    request = require('request'),
    fs = require('fs'),
    Adafruit = require('node-rpi-rgb-led-matrix/main');

module.exports = function(chains){ 
  if(!chains) chains = 1;
  var board = {
    height: 32,
    width: 32*chains
  },
  canvas = new Canvas(board.width, board.height),
  ctx = canvas.getContext('2d'),
  img = new Image,
  intervalSet = false;

  this.getUser = function(user, cb) {
    axios.get('https://slack.com/api/users.info?token=xoxp-2178724258-3223364896-3264573501-f0d2e1&pretty=1&user='+user)
      .then(function(response){
        cb(response.data.user);
      })
      .catch(function(err){
        console.log('user err', err);
      });
  };
  this.drawAvatar = function (name){
      var slack = this;
      fs.readFile('src/images/'+name+'.jpg', function(err, imageData){
          if(err) console.log('read error', err);
          img.src = imageData;
          var i = 0;
          var interval = setInterval(function(){
            intervalSet = true;
            if(i == 64) i = 0;
            i++;
            Adafruit.clear();
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(i, 0);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
            Adafruit.drawCanvas(ctx, board.width, board.height);
          }, 50);
          if(intervalSet){
            clearInterval(interval);
            intervalSet = false;
          }
          console.log('canvas', ctx);
      });
  };
  this.loadImage = function (src, name){
    var slack = this;
    console.log(src, '\n', name);
    fs.exists('src/images/'+name+'.jpg', function(exists) {
      if (exists) {
          console.log(name, 'exists');
          slack.drawAvatar(name);
      } else {
        var stream = request(src),
            writeStream = fs.createWriteStream('src/images/'+name+'.jpg'),
            ok = true;

        stream.on('data', function(data) {
          if(ok){
            console.log('chunk');
            ok = writeStream.write(data);
          } else{
            ok = writeStream.once('drain');
          }
        });
        
        stream.on('end', function() {
          console.log('chunk end');
          writeStream.end();
        });
        
        stream.on('finish', slack.drawAvatar(name));

        stream.on('error', function(err) {
          console.log('something is wrong :( ');
          writeStream.close();
        });
      }
    });
  };
  this.drawMessage = function(msg, color){
    if(!color) color = 'ffffff';
    Adafruit.clear();
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,board.width, board.height);
    ctx.font = "8px Verdana";
    ctx.fillStyle = '#'+ color;
    ctx.fillText(msg, 0,10);
    Adafruit.drawCanvas(ctx, board.width, board.height);
  };
  this.listenToSlack = function(){
    var slack = this;
    axios.get('https://slack.com/api/rtm.start?token=xoxp-2178724258-3223364896-3264573501-f0d2e1&pretty=1')
      .then(function(response){
        console.log(response.data.url)
        var socket_ = new WebSocket(response.data.url);
        socket_.on('message', function(data, flags){
          console.log(data);
          data = JSON.parse(data);
          if(data.user){
            //Write user's name on matrix if user in response
            slack.getUser(data.user, function(response){
              if(response.profile.image_32 && response.name){
                  slack.loadImage(response.profile.image_32, response.name);
              } else {
                slack.drawMessage(response.profile.first_name+'\n'+response.profile.last_name, response.color);
                console.log('user', response);
              }
            });
          } else {
            //Otherwise print type of message
            // slack.drawMessage(data.type, 'red');
          }
          console.log('message received');
        });
      })
      .catch(function(err){
        console.log('listen err', err);
      });
  };
  this.start = function(){
    Adafruit.start(board.height, board.width/32);
    this.listenToSlack();
    // console.log(this);
  }

};