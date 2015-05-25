var five = require("johnny-five");
var Rover = require("./rover")(five);
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

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
