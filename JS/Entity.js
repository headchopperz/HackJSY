function drawEntities(dt) {
    var X = 100;
    var Y = 100;
    for (var Ey = 0; Ey < Models[0].length; Ey++) {
        for (var Ex = 0; Ex < Models[0][Ey].length; Ex++) {
            var e = Models[0][Ey][Ex];
            if (e !== null) {
                context.beginPath();
                context.fillStyle = e;
                context.rect(X + (Ex * 5), Y + (Ey * 5), 5, 5);
                context.fill();
            }
        }
    }
}