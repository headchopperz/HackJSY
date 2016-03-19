/**
 * Stores every key that i currently being pressed
 * 
 * @type Array(Number)
 */
var keyArray = new Array();


/**
 * This variable stores the time in miliseconds of the last loop
 * @type (Number)
 */
var lastTime;

/**
 * This array stores a list of previous FPS states, so it can be averaged
 * @type Array(Number)
 */
var FPS = new Array();

/**
 * This block of code is a requestAnimationFrame fallback, for older browsers
 * 
 */
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

/**
 * Retrieve whether or not a key is currently being pressed
 * 
 * @param {Number} keyCode
 * @returns {Number}
 */
function getKeyPressed(keyCode, getIndex = false) {
    var keyIndex = false;
    
    for (var i = 0; i < keyArray.length; i++) {
        if (keyArray[i] === keyCode) {
            keyIndex = i;
        }
    }
    
    return keyIndex !== false ? (getIndex ? keyIndex : true) : false; //because 0 may be considered as false
}

/**
 * This is the program loop, but it isnt named that as i want to split the loop up
 * into the various parts
 * Ultimately this is the main entrance point of the application and wll hold the main code
 * @returns {bool}
 */
function main() {
    var now = Date.now();
    var dt = now - lastTime; //Time since last loop
    
    /**
     * If the time between since last loop is so great, then the jump it could cause
     * may actually break everything, so we skip that loop until the users computer
     * can handle the stress of... whatever they are dealing with
     */
    if (dt < 1000) {
        /*
         * if the user is not in the main menu
         */
        
        if (!menu) {
            sync(dt);
            mainLoop(dt);
        } else {
            sync(dt);
            drawButtons(dt);
        }
        
        drawdebug();
    }

    lastTime = now;
    
    /**
     * rerun the function when the computer can rerender the animation frame
     */
    requestAnimFrame(main);
    
}

function playGame(e) {
    console.log(e);
}

function drawdebug() {
    context.textAlign = 'left';
    context.font = "16px georgia";
    context.fillStyle = "white";
    context.fillText("X: " + _mouse.X,2,15);
    context.fillText("Y: " + _mouse.Y,2,35);
}

/**
 * This function will clear the current screen,
 * its meant to be un every loop to clear the frustrum, but possibly
 * should be recoded to only clear parts of screen
 */
function sync(dt) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function mouseCheck(e) {
    if (_mouse.Down) {
        Buttons.forEach(function (e) {
            if ((e.Visible == true) && (e._onClick !== null) && (!e.Pressed)) {
                var X = e.X;
                var Y = e.Y;
                
                if (e.Centered) {
                    X = e.X - (e.Width / 2);
                    Y = e.Y - (e.Height / 2);
                }

                if ((_mouse.X < X + e.Width) &&
                        (_mouse.X > X) &&
                        (_mouse.Y < Y + e.Height) &&
                        (_mouse.Y > Y)) {
                    e._onClick();
                }
            }
        });
    }
}

$(document).ready(function() {
    canvas.addEventListener("mousedown", function (e) {
        _mouse.Down = true;
        
        mouseCheck(e);
    });
    
    canvas.addEventListener("mouseup", function (e) {
        _mouse.Down = false;

        Buttons.forEach(function (e) {
            if ((e.Visible == true) && (e._onRelease !== null) && (e.Pressed)) {
                var X = e.X;
                var Y = e.Y;
                
                if (e.Centered) {
                    X = e.X - (e.Width / 2);
                    Y = e.Y - (e.Height / 2);
                }

                if ((_mouse.X < X + e.Width) &&
                        (_mouse.X > X) &&
                        (_mouse.Y < Y + e.Height) &&
                        (_mouse.Y > Y)) {
                    e._onRelease();
                }
            }
        });
    });

    canvas.addEventListener("mousemove", function (e) {
        _mouse.X = Math.round(e.pageX - $('#scene').offset().left, 10); //this window has a margin of 8
        _mouse.Y = Math.round(e.pageY - $('#scene').offset().top, 10); //this window has a margin of 8
        
        if (_mouse.X > scene.Viewport.Width) {
            _mouse.X = scene.Viewport.Width;
        } else if (_mouse.X < 0) {
            _mouse.X = 0;
        }
        if (_mouse.Y > scene.Viewport.Height) {
            _mouse.Y = scene.Viewport.Height;
        } else if (_mouse.Y < 0) {
            _mouse.Y = 0;
        }
        
        mouseCheck(e);
    });
    
    requestAnimFrame(main);
});