/**
 * The canvas an context is what we will use to modify the scene
 */
var canvas = document.getElementById("scene");
var context = canvas.getContext("2d");

/**
 * Are we currently in the main menu?
 * I personally wanted a better solution than this, but this was the easiest to make
 * @type Boolean
 */
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
    Tile_Size: 5 //Each model is made up of tiles, this is their size
};

/**
 * This object stores the current mouse state
 * @type (Object)
 */
var _mouse = {
    X: 0,
    Y: 0,
    Down: false //Whether the mouse is currently being clicked
}

/**
 * What button is being currently selected, this is needed for textbox editing purposes
 * 
 * @type (Object)
 */
var SelectedButton = null;

/**
 * When did the game start?
 * We need this so we can find out how much score to give the user...
 * @type Number
 */
var GameStart = Date.now();
var cTime = Date.now();
var score = 0;

/**
 * Is debug mode currently enabled?
 * @type Boolean
 */
var debug = false;

/**
 * I needed this boolean so i could make it so when the user pressed ctrl-d
 * it didnt swap in and out debug mode thousands of times
 * so this makes it so you have to release the keys before itll let you do it again
 * @type Boolean
 */
var debughasrisenkeys = true;

/**
 * What was the users last score?
 * its what we refer to in the highscore submission
 * @type Number
 */
var lastscore = 0;
