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

        if (audio.lastAudioUpdate + ((AudioList[0][audio.currentNote]['Duration'] * 400) / (0.75 + (getScore() / 7000))) < now) {
            if (++audio.currentNote >= AudioList[0].length) {
                audio.currentNote = 0;
            }

            audio.osc.frequency.value = AudioList[0][audio.currentNote]['Note'];
            audio.gain.gain.value = AudioList[0][audio.currentNote]['Volume'];
            audio.lastAudioUpdate = now;
        }

        if (!menu) {
            //checkmovementetc
            controlEntities(dt);
            sync(dt);
            drawAtmosphere(dt);
            drawEntities(dt);
            checkCollisions(dt);
            mainLoop(dt);
            showScore(dt);
        } else {
            sync(dt);
            if (getKeyPressed(KEY.SPACE) && (SelectedButton === null) && (Buttons[0].Visible)) {
                playGame();
            }
            drawButtons(dt);
        }

        if (debug) {
            drawdebug();
        }
    }

    lastTime = now;

    /**
     * rerun the function when the computer can rerender the animation frame
     */
    requestAnimFrame(main);

}

/**
 * 
 */
function playGame(e) {
    menu = false;
    GameStart = Date.now();
    
    Buttons[0].Visible = false;
    Buttons[1].Visible = false;
    Buttons[2].Visible = false;
    Buttons[3].Visible = false;
}

function drawdebug() {
    context.textAlign = 'left';
    context.font = "16px VT323,georgia";
    context.fillStyle = "white";
    context.fillText("X: " + _mouse.X, 2, 15);
    context.fillText("Y: " + _mouse.Y, 2, 35);
}

function showScore() {
    var now = Date.now();

    context.textAlign = 'right';
    context.font = "24px VT323,monospace,georgia";
    context.fillStyle = "white";
    context.fillText(getScore(), scene.Viewport.Width - 15, 30);
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
        if (menu) {
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
}

$(document).ready(function () {
    window.addEventListener("keydown", function (e) {
        if (!getKeyPressed(e.keyCode))
            keyArray.push(e.keyCode);
        
        if (SelectedButton !== null) {
            SelectedButton.TextBox.Value = String(SelectedButton.TextBox.Value);
            if ((e.keyCode == KEY.ENTER) || (e.keyCode == KEY.ESCAPE)) {
                SelectedButton = null;
            } else if ((e.keyCode == KEY.BACKSPACE) && (SelectedButton.TextBox.Value.length > 0)) {
                SelectedButton.TextBox.Value = SelectedButton.TextBox.Value.substring(0, SelectedButton.TextBox.Value.length - 1);
            } else if ((String.fromCharCode(e.keyCode)) && (SelectedButton.TextBox.Value.length < SelectedButton.TextBox.maxLength)) {                
                SelectedButton.TextBox.Value += String.fromCharCode(e.keyCode);
            }

            if ((SelectedButton !== null) && (SelectedButton.TextBox._oldValue !== SelectedButton.TextBox.Value))
                SelectedButton._onChanged();
        }
        
        e.preventDefault();
    });

    window.addEventListener("keyup", function (e) {
        keyIndex = getKeyPressed(e.keyCode, true);
        if (keyIndex !== false) {
            keyArray.splice(keyIndex, 1);
        }
        debughasrisenkeys = true;
    });

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

function getScore() {
    return score;
}

function gameOver() {
    menu = true;
    
    if (score > 0) {
        lastscore = score;
        score = 0;
    }
    
    Buttons[0].Visible = false;
    Buttons[1].Visible = false;
    Buttons[2].Visible = false;
    Buttons[3].Visible = false;
    Buttons[5].Visible = false;
    Buttons[6].Visible = false;
    
    
    Buttons[4].Visible = true;
    Buttons[2].Visible = true;
    Buttons[7].Visible = true;    
    Buttons[8].Visible = true;   
    Buttons[9].Visible = true;
    Buttons[10].Visible = true;
    Buttons[11].Visible = true;
    
    Buttons[10].Text.Value = "Score: " + lastscore;
    
    
}

function loadHighscores() {
    menu = true;
    highscores = true;
    
    Buttons[0].Visible = false;
    Buttons[1].Visible = false;
    Buttons[2].Visible = false;
    Buttons[3].Visible = false;
    
    Buttons[2].Visible = true;
    Buttons[4].Visible = true;
    Buttons[5].Visible = true;
    Buttons[6].Visible = true;
    
    Buttons[12].Visible = true;
    Buttons[13].Visible = true;
    Buttons[14].Visible = true;
    Buttons[15].Visible = true;
    Buttons[16].Visible = true;
    Buttons[17].Visible = true;
    Buttons[18].Visible = true;
    Buttons[19].Visible = true;
    Buttons[20].Visible = true;
    Buttons[21].Visible = true;
    
    Highscores.sort(compareScore);
    
    if (typeof Highscores[0] !== "undefined") {
        Buttons[12].Text.Value = "1. " + Highscores[0].Name + " ::: " + Highscores[0].Score;
    }
    if (typeof Highscores[1] !== "undefined") {
        Buttons[13].Text.Value = "2. " + Highscores[1].Name + " ::: " + Highscores[1].Score;
    }
    if (typeof Highscores[2] !== "undefined") {
        Buttons[14].Text.Value = "3. " + Highscores[2].Name + " ::: " + Highscores[2].Score;
    }
    if (typeof Highscores[3] !== "undefined") {
        Buttons[15].Text.Value = "4. " + Highscores[3].Name + " ::: " + Highscores[3].Score;
    }
    if (typeof Highscores[4] !== "undefined") {
        Buttons[16].Text.Value = "5. " + Highscores[4].Name + " ::: " + Highscores[4].Score;
    }
    if (typeof Highscores[5] !== "undefined") {
        Buttons[17].Text.Value = "6. " + Highscores[5].Name + " ::: " + Highscores[5].Score;
    }
    if (typeof Highscores[6] !== "undefined") {
        Buttons[18].Text.Value = "7. " + Highscores[6].Name + " ::: " + Highscores[6].Score;
    }
    if (typeof Highscores[7] !== "undefined") {
        Buttons[19].Text.Value = "8. " + Highscores[7].Name + " ::: " + Highscores[7].Score;
    }
    if (typeof Highscores[8] !== "undefined") {
        Buttons[20].Text.Value = "9. " + Highscores[8].Name + " ::: " + Highscores[8].Score;
    }
    if (typeof Highscores[9] !== "undefined") {
        Buttons[21].Text.Value = "10. " + Highscores[9].Name + " ::: " + Highscores[9].Score;
    }
}

function reloadPage() {
    location.reload();
}

function saveScore() {
    var Name = Buttons[7].TextBox.Value;
    if (Name.length === 0) {
        Name = "BadBreath";
    }
    var uScore = lastscore;
    
    var HighscoreItem = {
        "Name": Name,
        "Score": uScore
    }
    
    Highscores.push(HighscoreItem);
    Highscores.sort(compareScore);
    
    var textFileAsBlob = new Blob(["var Highscores=JSON.parse('" + JSON.stringify(Highscores) + "');"], {
        type: 'text/plain'
    });
    
    var downloadLink = document.createElement("a");
    downloadLink.download = "Highscore.json";
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = function (event) {
            document.body.removeChild(event.target);
        };
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function compareScore(a,b) {
    if (a.Score > b.Score)
        return -1;
    if (a.Score < b.Score)
        return 1;
    return 0;
}
