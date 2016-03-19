/**
 * 
 * Default button class
 */
var _button = {
    Description: "none found", //This description is just for human reading
    Visible: true, //Whether or not the button is visible
    X: 0, //The Coordinates
    Y: 0,
    Width: 0, //The Size
    Height: 0,
    Parent: null,
    Pressed: false, //Whether or not the button is currently pressed
    Fill: {//This class holds the information for the details that makeup the background of the button
        On: false,
        Colour: "black",
        Pressed: "black" //Colour when pressed
    },
    Outline: {//This class holds the information for the details that makeup the outline of the button
        On: false,
        Colour: "black", //Colour when pressed
        Pressed: "black"
    },
    Text: {//This class holds the information for the details that makeup the text of the button
        On: false,
        Center: true,
        Colour: "white",
        Pressed: "white", //Colour when pressed
        Outline: false,
        Value: "...", //What does the text say?
        Font: "Georgia",
        Size: 16 //In pixels (px)
    }
}
var Buttons = [];