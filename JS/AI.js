var _aiSpawn = {
    lastShipFleet: Date.now(),
    lastShipFleetShip: 0,
    ShipFleetStart: 0,
    cShipSpawn: 0,
    lastBoulder: 0
}

function handleAISpawning(dt) {
    var now = Date.now();
    
    if ((_aiSpawn.cShipSpawn === 0) && (_aiSpawn.lastShipFleet + (10000  / Math.floor(getScore() / 3000)) < now)) {
        _aiSpawn.cShipSpawn = 1;
        _aiSpawn.ShipFleetStart = Math.random() * 360;
        _aiSpawn.lastShipFleet = now;
        
        Entities.forEach(function(e, i) {
            if ((e.Group === AI_Group.Boulder) && (e.X < 400)) {
                var ID = Entities.push(JSON.parse(JSON.stringify(Entities[3]))) - 1;
                Entities[ID].State = 1;
                Entities[ID].X = 0;
                Entities[ID].Y = e.Y + (scene.Tile_Size * 4);
                Entities[ID].Physics.Velocity.X = 1 * getScore() / 15000;
            }
        });
    }
    
    
    if ((_aiSpawn.cShipSpawn > 0) && (_aiSpawn.lastShipFleetShip + 150 < now)) {
        
        var ID = Entities.push(JSON.parse(JSON.stringify(Entities[1]))) - 1; 
        Entities[ID].State = 1;
        Entities[ID].AI.SinWave = _aiSpawn.ShipFleetStart;
        Entities[ID].AI.lastBulletShot = now;
        Entities[ID].AI.nextBulletShot = Math.random() * 1000;
        
        if (++_aiSpawn.cShipSpawn > Math.round(1 + (getScore() / 5000))) {
            _aiSpawn.cShipSpawn = 0;
        }
        
        _aiSpawn.lastShipFleetShip = now;
    }
    
    if (_aiSpawn.lastBoulder + (3000 / (getScore() / 1000)) < now ) {
        var ID = Entities.push(JSON.parse(JSON.stringify(Entities[2]))) - 1;
        Entities[ID].State = 1;
        Entities[ID].X = scene.Viewport.Width;
        Entities[ID].Y = Math.random() * (scene.Viewport.Height - (8 * scene.Tile_Size));
        _aiSpawn.lastBoulder = now;
    }
}