/**
 * This function is the part of the code where i deal with the player in particular
 * 
 * @param {Number} dt
 * @returns {undefined}
 */
function mainLoop(dt) {
    var now = Date.now();
    
    /**
     * The way the score is calculated is by comparing the time from when the user started the game... to the current time
     * 
     * the problem with this is it has the AI Tetris bug.
     * 
     * Someone programmed an AI to master tetris, by making the AI think that the longer it survived the better it was doing,
     * so the AI just paused the game...
     * 
     * Well i have that problem, if you alt tab, your score will just keep going up....
     */
    score = (Math.floor((now - GameStart) / 5));
    
    /**
     * The generic, press right, you go right stuff
     */
    if (getKeyPressed(KEY.RIGHT_ARROW) || getKeyPressed(KEY.D)) {
        Entities[0].Physics.Velocity.X += Entities[0].Physics.Thrust * dt;
    }
    if (getKeyPressed(KEY.LEFT_ARROW) || getKeyPressed(KEY.A)) {
        Entities[0].Physics.Velocity.X -= Entities[0].Physics.Thrust * dt;
    }
    if (getKeyPressed(KEY.DOWN_ARROW) || getKeyPressed(KEY.S)) {
        Entities[0].Physics.Velocity.Y += Entities[0].Physics.Thrust * dt;
    }
    if (getKeyPressed(KEY.UP_ARROW) || getKeyPressed(KEY.W)) {
        Entities[0].Physics.Velocity.Y -= Entities[0].Physics.Thrust * dt;
    }
    
    /*
     * If you press Ctrl-D the debugger will appear, really this does nothing other
     * than show your mouse coordinates and it also shows the collision boxes of entities...
     * though they are EXACTLY what you expect them to be.
     */
    if (getKeyPressed(KEY.CTRL) && getKeyPressed(KEY.D) && debughasrisenkeys) {
        debug = !debug;
        debughasrisenkeys = false;
    }

    /**
     * This bit of code is the part of code that adds a constant pressure to the player to return to the left hand side of the screen
     * ideally it should be smoother, but id probably have to recode a lot of things
     */
    Entities[0].Physics.Velocity.X -= (0.0018 * (Entities[0].X / scene.Viewport.Width)) * dt;
    
    
    /**
     * This code gives the effect of us flying through space, by sliding the white gradient away
     */
    $('canvas').css('background-position-x', (-(Math.round(score / 25))) + 'px');
    $('canvas').css('background-repeat', 'no-repeat'); //this has to be redefined constantly because everyone loves css
}