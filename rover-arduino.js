var five = require("johnny-five");
var Rover = require("./rover")(five);
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static("./"));

var board = new five.Board();

board.on("ready", function() {
  var rover = new Rover([
    five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M1,
    five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M2,
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
