var ModelSet = [
    [0, 1],
    [2, 3, 4, 5],
    [6]
];

var AI_Type = {
    None: 0,
    SinWaveShooter: 1,
    Boulder: 2
}

var AI_State = {
    Locked: 0,
    Alive: 1,
    Dead: 1
}

var _entity = {
    Description: "none found",
    X: 0,
    Y: 0,
    Z: 0,
    old_X: 0,
    old_Y: 0,
    ModelSet: 0,
    CurrentModel: 0,
    LastModelUpdate: 0,
    AnimationSpeed: 25,
    State: 0,
    AIType: AI_Type.None,
    Physics: {
        On: false,
        Collision: false,
        MaxSpeed: 1,
        Drag: 0.10,
        Thrust: 0.33,
        Velocity: {
            X: 0,
            Y: 0
        }
    },
    AI: {
        SinWave: 0,
        LastShoot: 0
    }
}

if (typeof Entities === "undefined") {
    var Entities = new Array();
} else {
    /**
     * Buttons loaded from JSON will not have any of the default functions set
     */
    Entities.forEach(function(e) {
        e._onDeath = _entity._onDeath;
    });
}

function drawEntities(dt) {
    var now = Date.now();

    Entities.forEach(function(e, i) {
        if (e.State === 1) {
            if ((e.Physics.Velocity.Y !== 0) || (e.Physics.Velocity.X !== 0)) {

                if (e.Physics.Velocity.X > e.Physics.MaxSpeed) {
                    e.Physics.Velocity.X = e.Physics.MaxSpeed;
                } else if (e.Physics.Velocity.X < -e.Physics.MaxSpeed) {
                    e.Physics.Velocity.X = -e.Physics.MaxSpeed;
                }

                if (e.Physics.Velocity.Y > e.Physics.MaxSpeed) {
                    e.Physics.Velocity.Y = e.Physics.MaxSpeed;
                } else if (e.Physics.Velocity.Y < -e.Physics.MaxSpeed) {
                    e.Physics.Velocity.Y = -e.Physics.MaxSpeed;
                }

                e.X += e.Physics.Velocity.X * dt;
                e.Y += e.Physics.Velocity.Y * dt;

                if (e.Description === "Player") {
                    if (e.Y > scene.Viewport.Height) {
                        e.Y = 0;
                    } else if (e.Y < 0) {
                        e.Y = scene.Viewport.Height;
                    }
                    if (e.X > scene.Viewport.Width - (10 * scene.Tile_Size)) {
                        e.X = scene.Viewport.Width - (10 * scene.Tile_Size);
                    } else if (e.X < 0) {
                        e.X = 0;
                    }
                } else {
                    if (e.Y > scene.Viewport.Height) {
                        Entities.splice(i, 1);
                    } else if (e.Y < 0) {
                        Entities.splice(i, 1);
                    }
                    if (e.X > scene.Viewport.Width) {
                        Entities.splice(i, 1);
                    } else if (e.X < 0) {
                        Entities.splice(i, 1);
                    }
                }

                var DragWeight = (e.Physics.Drag * dt);

                if ((e.Physics.Velocity.X < DragWeight) && (e.Physics.Velocity.X > -DragWeight)) {
                    e.Physics.Velocity.X = 0;
                } else {
                    e.Physics.Velocity.X -= ((e.Physics.Velocity.X < 0) ? -DragWeight : DragWeight);
                }

                if ((e.Physics.Velocity.Y < DragWeight) && (e.Physics.Velocity.Y > -DragWeight)) {
                    e.Physics.Velocity.Y = 0;
                } else {
                    e.Physics.Velocity.Y -= ((e.Physics.Velocity.Y < 0) ? -DragWeight : DragWeight);
                }
            }

            if (e.LastModelUpdate + e.AnimationSpeed < now) {
                if (++e.CurrentModel > ModelSet[e.ModelSet].length - 1) {
                    e.CurrentModel = 0;
                }
                e.LastModelUpdate = now;
            }

            var ModelID = ModelSet[e.ModelSet][e.CurrentModel];

            for (var Ey = 0; Ey < Models[ModelID].length; Ey++) {
                for (var Ex = 0; Ex < Models[ModelID][Ey].length; Ex++) {
                    var ModelInfo = Models[ModelID][Ey][Ex];
                    if (ModelInfo !== null) {
                        context.beginPath();
                        context.fillStyle = ModelInfo;
                        context.rect(e.X + (Ex * 5), e.Y + (Ey * 5), 5, 5);
                        context.fill();
                    }
                }
            }
        }
    });
}

function controlEntities(dt) {
    var now = Date.now();

    Entities.forEach(function(e) {
        if (e.State === 1) {
            if (e.AIType === AI_Type.SinWaveShooter) {

                var ModelHeight = Models[ModelSet[e.ModelSet][e.CurrentModel]].length * scene.Tile_Size;

                e.AI.SinWave += 0.004 * dt;
                var oY = ((scene.Viewport.Height - ModelHeight) / 2) + (Math.sin(e.AI.SinWave) * ((scene.Viewport.Height - ModelHeight) / 2));



                /*
                 var diffY = oY - e.Y;
                 
                 e.Physics.Velocity.Y = diffY;
                 e.Physics.Velocity.X = 0.05;
                 */
                e.Y = oY;
                e.Physics.Velocity.X = 0.01 * dt;

            } else if (e.AIType === AI_Type.Boulder) {
                e.Physics.Velocity.X = -0.15;
            }
        }
    });
}

function checkCollisions(dt) {
    
}