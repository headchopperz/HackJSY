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
        Font: "VT323,Georgia",
        Size: 16 //In pixels (px)
    },    
    TextBox: {//Whether or not the text is modifiable, Requires Text
        On: false,
        Value: "",
        _oldValue: "",
        forceInt: false,
        forcePositive: false,
        maxLength: 21
    },
    /**
     * When the textbox info has changed
     * This function operates behind the scenes
     * @type function
     * @returns {null}
     */
    _onChanged: function() {
        this.TextBox._oldValue = this.TextBox.Value;
        
        if (typeof this.onChanged !== "undefined") {
            var fn = window[this.onChanged];
            if (typeof fn === "function") {
                fn.apply(null, [this]);
            }
        }
    },
    /**
     * When the button has been clicked
     * This function operates behind the scenes, it modifies the pressed value
     * @type function
     * @returns {null}
     */
    _onClick: function() {
        this.Pressed = true;
        
        if (this.TextBox.On)
            SelectedButton = this;
        
        if (typeof this.onClick !== "undefined") {
            var fn = window[this.onClick];
            if (typeof fn === "function") {
                fn.apply(null, [this]);
            }
        }
    },
    /**
     * When the cursor of the mouse has been released, after clicking
     * This function operates behind the scenes, it modifies the pressed value
     * @type function
     * @returns {null}
     */
    _onRelease: function() {
        this._onLeave();
        
        if (typeof this.onRelease !== "undefined") {
            var fn = window[this.onRelease];
            if (typeof fn === "function") {
                fn.apply(null, [this]);
            }
        }
    },
    /**
     * When the cursor leaves the button
     * This function operates behind the scenes, it modifies the pressed value
     * @type function
     * @returns {null}
     */
    _onLeave: function() {
        this.Pressed = false;
    },
    /**
     * The function to run when the button is pressed
     * @type function
     */
    onClick: null,
    /**
     * The function to run when the mouse is released
     * @type function
     */
    onRelease: null,
    /**
     * The function to run when the content is changed (textbox)
     * @type function
     */
    onChanged: null,
}

if (typeof Buttons === "undefined") {
    var Buttons = new Array();
} else {
    /**
     * Buttons loaded from JSON will not have any of the default functions set
     */
    Buttons.forEach(function(e) {
        e._onChanged = _button._onChanged;
        e._onClick = _button._onClick;
        e._onRelease = _button._onRelease;
        e._onLeave = _button._onLeave;
    });
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
                if (e.TextBox.On)
                    textValue += e.TextBox.Value;
                if (SelectedButton == e)
                    textValue += "_";
                
                context.fillStyle = (e.Pressed) ? e.Text.Pressed : e.Text.Colour;
                context.fillText(textValue, X + (e.Width / 2), Y + (e.Height / 2) + (e.Text.Size / 4));
            }

        }
    });
}