var ModelSet = [
    [0, 1]
];

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
    Physics: {
        On: false,
        Collision: false,
        Speed: 1
    }
}

if (typeof Entities === "undefined") {
    var Entities = new array();
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
    
    Entities.forEach(function(e) {
        
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
    });
}