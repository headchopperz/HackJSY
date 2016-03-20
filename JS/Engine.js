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
 * If i recall correctly i got it from stackoverflow years ago...
 * Its probably not even needed as this is probably now supported in most browsers
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
 * getIndex will return the index of the item in the keyArray, this is used when the
 * user lifts the key up afterwards, so i know its no longer being pressed.
 * 
 * Sidenote: ECMAScript 6 allows javascript to have default values in functions now...
 * but my IDE doesnt seem to know this yet, so its possible that this function will 
 * have terrible formatting
 * 
 * @param {Number} keyCode
 * @param {Boolean} getIndex
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

        /**
         * This code is responsible for playing the themesong
         * What it does is, when the time is right, it just plays the next note in the list
         * When the user is progressing through the game, the music plays faster and faster as the game gets harder
         */
        if (audio.lastAudioUpdate + ((AudioList[0][audio.currentNote]['Duration'] * 400) / (2 + (getScore() / 7000))) < now) {
            /**
             * If the current note exceeds the length, then they have to start from the beginning again
             */
            if (++audio.currentNote >= AudioList[0].length) {
                audio.currentNote = 0;
            }

            audio.osc.frequency.value = AudioList[0][audio.currentNote]['Note']; //this is what plays that note
            audio.gain.gain.value = AudioList[0][audio.currentNote]['Volume'] * audio.volume; //Different notes can have different volume (and do), audio.volume is the master volume
            audio.lastAudioUpdate = now;
        }

        /*
         * if the user is not in the main menu
         */
        if (!menu) {
            /**
             * This function is in charge of handling AI spawning
             */
            handleAISpawning(dt);
            /**
             * This function is in charge of deciding where the AI should next move.
             * For rocks its very simple...
             * for spaceships it is just following the sine wave...
             * To be honest i was expecting to write more here
             */
            controlEntities(dt);
            
            /**
             * This clears the screen for the next drawing
             * I try to put the computational stuff BEFORE the clearing of the screen
             * this is so there is less of a delay from the clearing of the screen to putting the
             * next images up (so it appears less laggy), it wont actually change anything as such, but it will feel smoother
             */
            sync(dt);
            
            /**
             * This code draws those dashes and stuff, meant to make the player feel like they are in space
             * but dont ask me what that feels like
             */
            drawAtmosphere(dt);
            
            /**
             * This function draws the games various entities, and it actually does more processing than i would like
             * this function also handles Entity movement, which if i had time to refactor my code, i would definitely move that 
             * to controlEntities
             * 
             * PS: this includes the player
             */
            drawEntities(dt);
            
            /**
             * DO WE COLLIDE WITH ANYTHING?!
             * This code was before the sync, but for debug purposes i moved it down here as it now adds a special features in debug mode
             * where you can see what items can collide with what (they are marked pink)
             */
            checkCollisions(dt);
            
            /**
             * Player movement and stuff happens in this bit
             */
            mainLoop(dt);
            
            /**
             * And we show the score in the top right in this code
             */
            showScore(dt);
        } else {
            /**
             * When the user is in menu mode, we have a lot less to do
             */
            sync(dt);
            /**
             * I decided it would be sweet to just play the game if the player pressed space...
             * so i did it
             */
            if (getKeyPressed(KEY.SPACE) && (SelectedButton === null) && (Buttons[0].Visible)) {
                playGame();
            }
            /**
             * Draw the various text elements that are needed
             */
            drawButtons(dt);
        }
        
        /**
         * If we are in debug mode, then we show the various debug menus...
         * When i say various, i mean it as in...
         * The various debug menus that i would have had if i had time to make them....
         * In reality it just shows the mouse coordinates
         */
        if (debug) {
            drawdebug();
        }
    }

    lastTime = now;

    /**
     * rerun the function when the computer can render the animation frame
     */
    requestAnimFrame(main);

}

/**
 * This function plays the game, because the game is ALWAYS loaded from a fresh state,
 * (The browser refreshes before each replay... cheating i know)
 * I dont need to do a lot of setting up or dismanteling of old props
 */
function playGame(e) {
    menu = false; //take off our stabalisers
    GameStart = Date.now(); //this is needed so we know the users score

    /**
     * Hide the various button stuff for the homepage.
     * 
     * I was originally wanting to make some sort of container item for Buttons
     * so i could just put here
     * Container[1].Hide(), or something, and it would hide all its relevent buttons
     * but i didnt have time to add that in
     */
    Buttons[0].Visible = false;
    Buttons[1].Visible = false;
    Buttons[2].Visible = false;
    Buttons[3].Visible = false;
}

/*
 * This function shows the mouse coordinates
 * @returns {undefined}
 */
function drawdebug() {
    context.textAlign = 'left';
    context.font = "16px VT323,georgia";
    context.fillStyle = "white";
    context.fillText("X: " + _mouse.X, 2, 15);
    context.fillText("Y: " + _mouse.Y, 2, 35);
}

/**
 * This function shows the players score
 * @returns {undefined}
 */
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

/**
 * So the player has done something with their mouse and now we are here.
 * Here being, making sure that they didnt do anything stupid like click on any buttons
 * @param {type} e
 * @returns {undefined}
 */
function mouseCheck(e) {
    if (_mouse.Down) { //If the mouse is down
        if (menu) { //And we are on the main menu
            /**
             * Then we scan through all of the buttons on the that are currently visible
             */
            Buttons.forEach(function (e) {
                if ((e.Visible == true) && (e._onClick !== null) && (!e.Pressed)) {
                    /**
                     * To make sure the user has clicked on it, we have to get the coordinates of the button
                     * and adjust those coordinates for anything like centering
                     * @type Number
                     */
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
                        e._onClick(); //do whatever the click event is
                    }
                }
            });
        }
    }
}

/**
 * So if you are reading the code, up until the point, nothing has happened.
 * Its just us declaring functions, variables etc
 * 
 * This bit of code here is responsible for "Starting" everything, and it runs when the document has finished loading
 * 
 * This block of code is also what runs main() for the first time
 */
$(document).ready(function () {
    /**
     * we add our event listeners, this is how we know what the player is doing
     */
    window.addEventListener("keydown", function (e) {
        /**
         * If the key has not already been pressed, then we add it to our list of keys that the user is pressing
         */
        if (!getKeyPressed(e.keyCode)) {
            keyArray.push(e.keyCode);
        }
        
        /**
         * If the user is selecting a textbox while pressing this key, then we add whatever this key is to that textbox field.
         * There is a problem though with what you do when the person does something funny, like pressing a key that is a modifier rather than a letter
         * im not sure how to fix that
         * but something like shift would put funny \000 and stuff in the system and will break the highscores,
         * would have to google
         */
        if (SelectedButton !== null) {
            SelectedButton.TextBox.Value = String(SelectedButton.TextBox.Value);
            if ((e.keyCode == KEY.ENTER) || (e.keyCode == KEY.ESCAPE)) { //If the user pressed enter of escape, we can assume they want to stop editing this textbox
                SelectedButton = null;
            } else if ((e.keyCode == KEY.BACKSPACE) && (SelectedButton.TextBox.Value.length > 0)) { //if the user did backspace, then we can assume they want to remove stuff
                SelectedButton.TextBox.Value = SelectedButton.TextBox.Value.substring(0, SelectedButton.TextBox.Value.length - 1);
            } else if ((String.fromCharCode(e.keyCode)) && (SelectedButton.TextBox.Value.length < SelectedButton.TextBox.maxLength)) { //otherwise we add this key to the textbox, if its valid
                SelectedButton.TextBox.Value += String.fromCharCode(e.keyCode);
            }

            /**
             * We run the event that tells us the element has also changed its text, i dont actually use this
             * i was planning on doing something with it on the highscores, but i changed my mind
             */
            if ((SelectedButton !== null) && (SelectedButton.TextBox._oldValue !== SelectedButton.TextBox.Value))
                SelectedButton._onChanged();
        }

        e.preventDefault(); //stops the browser from doing what it was meant to do
    });

    window.addEventListener("keyup", function (e) {
        /**
         * If the user releases their key, then we must remove it from our list of keys they are holding down
         */
        keyIndex = getKeyPressed(e.keyCode, true);
        if (keyIndex !== false) {
            keyArray.splice(keyIndex, 1);
        }
        debughasrisenkeys = true; //this is so they can open the debug menu again
    });

    /**
     * If the user presses the mouse down... then record it.. also check to make sure they didnt click on a button
     */
    canvas.addEventListener("mousedown", function (e) {
        _mouse.Down = true;

        mouseCheck(e);
    });

    /**
     * If the user reaises their mouse again then we need to also record that,
     * we also need to find all the buttons that could be affected by this and run any code for when they were released.
     * most buttons (if not all), now use the onRelease() function, whereas before they were built on the onCLick one
     */
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

    /**
     * Mousemove, did the user move their mouse? then record it
     */
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

        mouseCheck(e); //this is incase the user pressed their mouse down, then moved their mouse OVER a button while it was down
    });

    /**
     * and now... after all that, we actually start the game
     */
    requestAnimFrame(main);
});

/**
 * Originally this function actually calculated the score, but i think it was more performant to do it like this
 * @returns {Number}
 */
function getScore() {
    return score;
}

/**
 * This function is run when the user dies, it asks the player to submit their score
 * @returns {undefined}
 */
function gameOver() {
    menu = true; //stop running the game

    /**
     * Unload all entities
     */
    Entities.forEach(function (e, i) {
        if ((typeof e.Audio !== "undefined") && (typeof e.Audio.osc !== "undefined")) {
            e.Audio.osc.stop(0);
        }
        Entities.splice(i, 1);
    });

    /**
     * We use lastscore, so we can set score to 0...
     * this is important because the audio still references score, and we want it to go back to normal
     */
    if (score > 0) {
        lastscore = score;
        score = 0;
    }

    /*
     * Load the various text elements that are needed
     */
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

    Buttons[10].Text.Value = "Score: " + lastscore; //show the users score


}

/**
 * Show the highscores
 * @returns {undefined}
 */
function loadHighscores() {
    menu = true;

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

    Highscores.sort(compareScore); //sort the scores DESC

    /**
     * Show all the relevent highscore places
     */
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

/**
 * Reload the page
 * this is the cheaty way of reloading the game
 * @returns {undefined}
 */
function reloadPage() {
    location.reload();
}

/**
 * This function saves the users score to the highscores
 * @returns {undefined}
 */
function saveScore() {
    var Name = Buttons[7].TextBox.Value; //Whatever name the player chose
    if (Name.length === 0) {
        Name = "BadBreath"; //if they didnt we give them a fancy default
    }
    var uScore = lastscore;

    /*
     * This is the highscore item that we will save
     */
    var HighscoreItem = {
        "Name": Name,
        "Score": uScore
    }

    /**
     * Add it and sort it
     */
    Highscores.push(HighscoreItem);
    Highscores.sort(compareScore);

    /**
     * Because of very strict browser security rules, and all sorts of various things
     * the methods javascript has to saving files is often unsupported, unless its a fancy work around.
     * 
     * this is a fancy work around which modern browsers allow because its obvious to the user of whats happening
     * the user though must save the file in the right place, which overwrites Highscores.json
     */
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

/**
 * This function compares two highscore elements and sorts them descendingly
 * @param {Highscore Class} a
 * @param {Highscore Class} b
 * @returns {Number}
 */
function compareScore(a, b) {
    if (a.Score > b.Score)
        return -1;
    if (a.Score < b.Score)
        return 1;
    return 0;
}
