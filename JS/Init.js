var canvas = document.getElementById("scene");
var context = canvas.getContext("2d");

var menu = true;

/*
 * If fullscreen than use winow.innerWidth
 */
canvas.width = 1200;
canvas.height = 500;

/*
 * The scene controls the region of the canvas that the game operates within
 * the scene could be the entirety of the canvas, or only a small part,
 * All measurements are taken from the top left of the canvas
 */
var scene = {
    X:0, //X of Scene
    Y:0, //Y of Scene
    Viewport: {
        Width: 1200, //Width of Scene
        Height: 500 //Height of Scene
    }, 
    Tile_Size: 5, //These tils are collision boxes
    Offset: {
        X: 0,
        Y: 0
    }
    
};