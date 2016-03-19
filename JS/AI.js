var _aiSpawn = {
    lastShipFleet: 0,
    lastShipFleetShip: 0,
    ShipFleetStart: 0,
    cShipSpawn: 0,
    lastBoulder: 0
}

function handleAISpawning(dt) {
    var now = Date.now();
    
    if ((_aiSpawn.cShipSpawn === 0) && (_aiSpawn.lastShipFleet + 15000 < now)) {
        _aiSpawn.cShipSpawn = 1;
        _aiSpawn.ShipFleetStart = Math.random() * 360;
        _aiSpawn.lastShipFleet = now;
    }
    
    
    if ((_aiSpawn.cShipSpawn > 0) && (_aiSpawn.lastShipFleetShip + 150 < now)) {
        
        var ID = Entities.push(JSON.parse(JSON.stringify(Entities[1]))) - 1; 
        Entities[ID].State = 1;
        Entities[ID].AI.SinWave = _aiSpawn.ShipFleetStart;
        Entities[ID].AI.lastBulletShot = now;
        Entities[ID].AI.nextBulletShot = Math.random() * 1000;
        
        if (_aiSpawn.cShipSpawn++ > 1 + Math.round((Math.random() * 3))) {
            _aiSpawn.cShipSpawn = 0;
        }
        
        _aiSpawn.lastShipFleetShip = now;
    }
    
    if (_aiSpawn.lastBoulder + 1500 < now) {
        var ID = Entities.push(JSON.parse(JSON.stringify(Entities[2]))) - 1;
        Entities[ID].State = 1;
        Entities[ID].X = scene.Viewport.Width;
        Entities[ID].Y = Math.random() * scene.Viewport.Height;
        _aiSpawn.lastBoulder = now;
    }
}