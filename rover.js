module.exports = function(five) {
  var Board = five.Board;

  return (function() {
    var priv = new Map();

    function Component(pinDefs) {

      pinDefs[0].threshold = 0;
      pinDefs[1].threshold = 0;

      var state = {
        motors: new five.Motors(pinDefs),
        direction: null,
        speed: Object.defineProperties({}, {
          right: {
            get: function() {
              return state.motors[0].currentSpeed;
            }
          },
          left: {
            get: function() {
              return state.motors[1].currentSpeed;
            }
          }
        })
      };

      priv.set(this, state);

      Object.defineProperties(this, {
        direction: {
          get: function() {
            return state.direction;
          }
        }
      });

      state.motors.fwd(0);
    }

    var methods = {
      fwd: ["fwd", "fwd"],
      rev: ["rev", "rev"],
      left: ["fwd", "rev"],
      right: ["rev", "fwd"],
    };

    function update(direction, value) {
      var state = priv.get(this);
      var speed = Board.map(value, 0, 100, 0, 255) | 0;
      var isDirChange = state.direction !== direction;

      if (isDirChange) {
        state.motors[0][methods[direction][0]]();
        state.motors[1][methods[direction][1]]();
      }

      if (state.speed.right !== speed) {
        state.motors[0].speed(speed);
      }

      if (state.speed.left !== speed) {
        state.motors[1].speed(speed);
      }

      state.direction = direction;
    }

    ["fwd", "rev", "left", "right"].forEach(function(operation) {
      Component.prototype[operation] = function(value) {
        update.call(this, operation, value);
      };
    });

    Component.prototype.speed = function(value) {
      update.call(this, this.direction, value);
    };

    Component.prototype.stop = function() {
      update.call(this, this.direction, 0);
    };

    return Component;
  }());
};


/**
 *  To use the plugin in a program:
 *
 *  var five = require("johnny-five");
 *  var Component = require("component")(five);
 *
 *
 */
