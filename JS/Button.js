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
    Centered: true,
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
    },    
    TextBox: {//Whether or not the text is modifiable, Requires Text
        On: false,
        Value: "",
        _oldValue: "",
        forceInt: false,
        forcePositive: false
    },
}

if (typeof Buttons === "undefined") {
    var Buttons = new array();
}

/**
 * This function draws the buttons to the screen
 * @param {int} dt - ms since last load
 * @returns {null}
 */
function drawButtons(dt) {
    Buttons.forEach(function(e) {
        if (e.Visible == true) {
            var X = e.X;
            var Y = e.Y;
            
            if (e.Centered) {
                X = e.X - (e.Width / 2);
                Y = e.Y - (e.Height / 2);
            }

            if (e.Pressed) {
                if (!((_mouse.X < X + e.Width) &&
                        (_mouse.X > X) &&
                        (_mouse.Y < Y + e.Height))) {
                    e._onLeave();
                }
            }

            context.beginPath();
            context.rect(X, Y, e.Width, e.Height);
            if (e.Fill.On) {
                if (e.Fill.Colour !== null) {
                    context.fillStyle = (e.Pressed) ? e.Fill.Pressed : e.Fill.Colour;
                    context.fill();
                }
            }
            if (e.Outline.On) {
                context.strokeStyle = (e.Pressed) ? e.Outline.Pressed : e.Outline.Colour;
                context.stroke();
            }
            context.closePath();

            if (e.Text.On) {
                context.font = e.Text.Size + "px " + e.Text.Font;
                if (e.Text.Center)
                    context.textAlign = 'center';
                else
                    context.textAlign = 'left';
                
                var textValue = e.Text.Value;
                
                context.fillStyle = (e.Pressed) ? e.Text.Pressed : e.Text.Colour;
                context.fillText(textValue, X + (e.Width / 2), Y + (e.Height / 2) + (e.Text.Size / 2));
            }

        }
    });
}