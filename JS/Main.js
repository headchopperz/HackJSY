function mainLoop(dt) {
    var now = Date.now();
    score = (Math.floor((now - GameStart) / 5));
    
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
    
    if (getKeyPressed(KEY.CTRL) && getKeyPressed(KEY.D) && debughasrisenkeys) {
        debug = !debug;
        debughasrisenkeys = false;
    }

    Entities[0].Physics.Velocity.X -= (0.0018 * (Entities[0].X / scene.Viewport.Width)) * dt;
    
    handleAISpawning(dt);
    
    $('canvas').css('background-position-x', (-(Math.round(score / 25))) + 'px');
    $('canvas').css('background-repeat', 'no-repeat');
}