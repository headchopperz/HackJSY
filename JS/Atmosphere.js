var _dash = {
    X: 0,
    Y: 0,
    Width: 0,
    Height: 1,
    Colour: "#eee"
};

var Dashes = new Array();


var lastAtmosphereDraw = 0;


function drawAtmosphere() {
    var now = Date.now();
    
    var lineAm = 20;

    if (lastAtmosphereDraw + 320 < now) {

        Dashes = new Array();

        for (var i = 0; i < lineAm; i++) {
            Dashes[i] = $.extend({}, _dash);
            Dashes[i].X = Math.random() * scene.Viewport.Width;
            Dashes[i].Y = Math.random() * scene.Viewport.Height;
            Dashes[i].Width = 5 + Math.random() * 185;
            Dashes[i].Height = 1;
            Dashes[i].Colour = parseInt(0 + (((1 - (Dashes[i].Width / 100)) * 200)), 10);
        }

        lastAtmosphereDraw = now;
    }

    for (var i = 0; i < lineAm; i++) {

        context.beginPath();
        context.fillStyle = "#eee";

        context.moveTo(Dashes[i].X, Dashes[i].Y);
        context.lineTo(Dashes[i].X + Dashes[i].Width, Dashes[i].Y);

        context.lineWidth = Dashes[i].Height;
        context.strokeStyle = 'rgb(' + Dashes[i].Colour + ',' + Dashes[i].Colour + ',' + Dashes[i].Colour + ')';
        context.stroke();

    }

}