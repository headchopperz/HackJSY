function mainLoop(dt) {
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
}