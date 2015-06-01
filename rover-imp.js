var five = require("johnny-five");
var Rover = require("./rover")(five);
var Imp = require("imp-io");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static("./"));

var board = new five.Board({
  io: new Imp({
    agent: process.env.IMP_AGENT_ID
  })
});


board.on("ready", function() {
  var rover = new Rover([
    { pins: { pwm: 5, dir: 7 } },
    { pins: { pwm: 8, dir: 9 } },
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

