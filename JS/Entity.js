var ModelSet = [
    [0, 1],
    [2, 3, 4, 5],
    [6],
    [7, 8],
    [9, 10, 11, 12, 13, 14]
];

var AI_Type = {
    None: 0,
    SinWaveShooter: 1,
    Boulder: 2,
    Bullet: 3,
    Explosion: 4
}

var AI_Group = {
    None: 0,
    Player: 1,
    Ships: 2,
    Boulder: 3,
    Bullet: 4
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
    State: AI_State.Locked,
    Group: AI_Group.None,
    Hardness: 0, //On Collision, what survives, the thing with the most hardness
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
        LastShoot: 0,
        lastBulletShot: 0,
        nextBulletShot: 0
    },
    Audio: {
        ctx: null,
        osc: null,
        gain: null
    }
}

if (typeof Entities === "undefined") {
    var Entities = new Array();
} else {
    /**
     * Buttons loaded from JSON will not have any of the default functions set
     */
    Entities.forEach(function (e) {
        e._onDeath = _entity._onDeath;
    });
}

function drawEntities(dt) {
    var now = Date.now();

    Entities.forEach(function (e, i) {
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
                    if (e.Y > scene.Viewport.Height - (8 * scene.Tile_Size)) {
                        e.Y = scene.Viewport.Height - (8 * scene.Tile_Size);
                    } else if (e.Y < 0) {
                        e.Y = 0;
                    }
                    if (e.X > scene.Viewport.Width - (10 * scene.Tile_Size)) {
                        e.X = scene.Viewport.Width - (10 * scene.Tile_Size);
                    } else if (e.X < 0) {
                        e.X = 0;
                    }
                } else {
                    if (e.Y > scene.Viewport.Height) {
                        killEntity(e, false);
                        return;
                    } else if (e.Y < 0) {
                        killEntity(e, false);
                        return;
                    }
                    if (e.X > scene.Viewport.Width) {
                        killEntity(e, false);
                        return;
                    } else if (e.X < 0) {
                        killEntity(e, false);
                        return;
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
                    if (e.Description === "Explosion") {
                        killEntity(e, false);
                        return;
                    }
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
                        context.rect(e.X + (Ex * scene.Tile_Size), e.Y + (Ey * scene.Tile_Size), scene.Tile_Size, scene.Tile_Size);
                        context.fill();
                    }
                }
            }
        }
    });
}

function controlEntities(dt) {
    var now = Date.now();

    Entities.forEach(function (e) {
        if (e.State === 1) {
            if (e.AIType === AI_Type.SinWaveShooter) {

                var ModelHeight = Models[ModelSet[e.ModelSet][e.CurrentModel]].length * scene.Tile_Size;

                e.AI.SinWave += 0.002 * dt;
                var oY = ((scene.Viewport.Height - ModelHeight) / 2) + (Math.sin(e.AI.SinWave) * ((scene.Viewport.Height - ModelHeight) / 2));


                if (e.AI.lastBulletShot + e.AI.nextBulletShot < now) {
                    var ID = Entities.push(JSON.parse(JSON.stringify(Entities[3]))) - 1;
                    Entities[ID].State = 1;
                    Entities[ID].X = e.X;
                    Entities[ID].Y = e.Y + (scene.Tile_Size * 2);
                    Entities[ID].Physics.Velocity.X = 1 * (getScore() / 15000);

                    e.AI.lastBulletShot = now;
                    e.AI.nextBulletShot = 500 + Math.random() * 4000;
                }

                if (loadEntitiesAudio(e)) {
                    e.Audio.osc.start(0);
                }

                e.Audio.osc.frequency.value = 100 + e.Y;


                /*
                 var diffY = oY - e.Y;
                 
                 e.Physics.Velocity.Y = diffY;
                 e.Physics.Velocity.X = 0.05;
                 */
                e.Y = oY;
                e.Physics.Velocity.X = 0.01 * dt;

            } else if (e.AIType === AI_Type.Boulder) {
                e.Physics.Velocity.X = -(0.05 * (getScore() / 750));
            } else if (e.AIType === AI_Type.Bullet) {
                if (loadEntitiesAudio(e)) {
                    e.Audio.osc.start(0);
                }
                e.Audio.osc.frequency.value = 150 + Math.sin(e.X);
            } else if (e.AIType === AI_Type.Explosion) {
                if (loadEntitiesAudio(e)) {
                    e.Audio.osc.start(0);
                }
            }
        }
    });
}

var lastCollissionCheck = 0;
function checkCollisions(dt) {
    var now = Date.now();
    if (lastCollissionCheck + 0 < now) {
        Entities.forEach(function (e1, i1) {
            Entities.forEach(function (e2, i2) {
                if ((i1 !== i2) && (e1.Group !== e2.Group) && (e1.State === AI_State.Alive) && (e2.State === AI_State.Alive) && (e1.Physics.Collision) && (e2.Physics.Collision) && (!menu)) {
                    if (doEntitiesCollide(e1, e2)) {
                        handleCollision(e1, e2);
                        return;
                    }
                }
            });
        });
        lastCollissionCheck = now;
    }
}

function doEntitiesCollide(e1, e2) {
    var xDistance = e1.X - e2.X;
    var yDistance = e1.Y - e2.Y;
    var Distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

    /*
     * If the other object is not within 75 pixels, then we do not bother checking for collisions
     */
    if (Distance < 75) {

        var ModelID = ModelSet[e1.ModelSet][e1.CurrentModel];

        var ComparedModelID = ModelSet[e2.ModelSet][e2.CurrentModel];

        for (var Ey = 0; Ey < Models[ModelID].length; Ey++) {
            for (var Ex = 0; Ex < Models[ModelID][Ey].length; Ex++) {
                var ModelInfo = Models[ModelID][Ey][Ex];
                if (ModelInfo !== null) {
                    for (var cEy = 0; cEy < Models[ComparedModelID].length; cEy++) {
                        for (var cEx = 0; cEx < Models[ComparedModelID][cEy].length; cEx++) {
                            var ModelInfo2 = Models[ComparedModelID][cEy][cEx];
                            if (ModelInfo2 !== null) {
                                var block1X = e1.X + (Ex * scene.Tile_Size);
                                var block1Y = e1.Y + (Ey * scene.Tile_Size);

                                var block2X = e2.X + (cEx * scene.Tile_Size);
                                var block2Y = e2.Y + (cEy * scene.Tile_Size);
                                
                                if (debug) {
                                    context.beginPath();
                                    context.fillStyle = "pink";
                                    context.rect(e2.X + (cEx * scene.Tile_Size), e2.Y + (cEy * scene.Tile_Size), scene.Tile_Size, scene.Tile_Size);
                                    context.fill();
                                }

                                if ((block1X < block2X + scene.Tile_Size) &&
                                        (block1X + scene.Tile_Size > block2X) &&
                                        (block1Y < block2Y + scene.Tile_Size) &&
                                        (block1Y + scene.Tile_Size > block2Y)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function handleCollision(e1, e2) {
    //im too tired to do this better
    if (e1.Hardness < e2.Hardness) {
        killEntity(e1);
        if (e2.AIType === AI_Type.Bullet) {
            killEntity(e2, false);
        }
    } else {
        killEntity(e2);
        if (e1.AIType === AI_Type.Bullet) {
            killEntity(e1, false);
        }
    }
}

function killEntity(e, explosion = true) {
    if (explosion) {
        var ID = Entities.push(JSON.parse(JSON.stringify(Entities[4]))) - 1;
        Entities[ID].State = 1;
        Entities[ID].X = e.X;
        Entities[ID].Y = e.Y + (scene.Tile_Size * 2);
    }

    if (e.Description === "Player") {
        gameOver();
    } else {
        Entities.forEach(function (eN, i) {
            if (eN === e) {
                if ((typeof e.Audio !== "undefined") && (typeof e.Audio.osc !== "undefined")) {
                    e.Audio.osc.stop(0);
                }
                Entities.splice(i, 1);
            }
        });
    }
}

function loadEntitiesAudio(e) {
    if ((typeof e.Audio === "undefined") || (typeof e.Audio.gain === "undefined")) {
        e.Audio = new Array();

        //e.Audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
        e.Audio.gain = audio.ctx.createGain();
        e.Audio.osc = audio.ctx.createOscillator();
        e.Audio.osc.connect(e.Audio.gain);
        e.Audio.gain.connect(audio.ctx.destination);

        e.Audio.osc.type = 'triangle';
        e.Audio.osc.frequency.value = 100;
        e.Audio.gain.gain.value = 0.15;

        return true;
    }
    return false;

}