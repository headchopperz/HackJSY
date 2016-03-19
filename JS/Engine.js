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
            drawButtons();
        }
    }

    lastTime = now;
    
    /**
     * rerun the function when the computer can rerender the animation frame
     */
    requestAnimFrame(main);
    
}

/**
 * This function will clear the current screen,
 * its meant to be un every loop to clear the frustrum, but possibly
 * should be recoded to only clear parts of screen
 */
function sync(dt) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

$(document).ready(function() {
    requestAnimFrame(main);
});