var five = require("johnny-five");
var Rover = require("./rover")(five);
var Edison = require("galileo-io");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static("./"));

var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  var rover = new Rover([
    { pins: { pwm: 0, dir: 4 } },
    { pins: { pwm: 14, dir: 6 } },
  ]);

  io.on("connection", function(socket) {
    console.log("Rover Control Center: Connected");
    socket.on("instruction", function(data) {
      rover[data.command](data.speed);
    });
  });

  http.listen(3000, function() {
    console.log("http://localhost:3000");
  });
});

