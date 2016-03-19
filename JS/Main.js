var lastShip = 0;

function mainLoop(dt) {
    var now = Date.now();
    
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

    Entities[0].Physics.Velocity.X -= (0.0018 * (Entities[0].X / scene.Viewport.Width)) * dt;
    
    if (lastShip + 1500 < now) {
        var ID = Entities.push(JSON.parse(JSON.stringify(Entities[1]))) - 1; 
        Entities[ID].State = 1;
        lastShip = now;
        
    }
}