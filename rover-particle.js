var five = require("johnny-five");
var Rover = require("./rover")(five);
var Particle = require("particle-io");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static("./"));

var board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_DEVICE_2
  })
});

board.on("ready", function() {
  var rover = new Rover([
    { pins: { pwm: "D0", dir: "D2" } },
    { pins: { pwm: "D1", dir: "D3" } },
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

