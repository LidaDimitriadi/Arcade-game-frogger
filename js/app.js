/* The bugs start at a random time to appear on screen 
*  and each has a random speed and random row.
*  I have an array of 3 bugs. When a bug reaches the end of the canvas it is removed and
*  a new one is created and pushed to the allEnemies array.
*/
var Enemy = function(row) {
    this.sprite = 'images/enemy-bug.png';
    this.row = row;         //random 1, 2 or 3
    this.x = 0;             //at the start x=0
    this.speed = Math.floor((Math.random() * 500) + 100);       
    this.start = Math.floor((Math.random() * 3000) + 100);       
    this.time = 0;
};


//the update function starts to update the position
//of the bugs only when the appear on screen after randon time (this.start)
//so I check the time to equal this.start
Enemy.prototype.update = function(dt, i) {                  
    this.time = this.time + dt * 1000;          //this.time is updated everytime
    if (this.time >= this.start) {              //if it is equal to this.start the bug appears on screen
        this.x = this.x + this.speed * dt;                      //I update the position according to the bug's speed
        if(this.x > 505) {                  //if the bug reaches the end of the canvas
            row = Math.floor((Math.random() * 3) + 1);          //new one
            var enemy = new Enemy(row);
            allEnemies.splice(i, 1, enemy);                     
        }                                                       
    }
};


Enemy.prototype.render = function() {
    var x = this.x;
    var y = this.row * 73;
    if (this.time >= this.start) {          //the bug is rendered only if the this.start time has passed
        ctx.drawImage(Resources.get(this.sprite), x, y);
    }
};

/*  The player has a starting position (in rows and columns)
*   a score set to zero 
*   and 3 lives
*/


var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.row = 5;                 //the start position of the player
    this.col = 2;
    this.score = 0;
    this.life = 3;
}

Player.prototype.render = function() {       //renders the player
    var x = player.col * 101;
    var y = player.row * 78;
    var img = new Image();
    img.src = this.sprite;
    ctx.drawImage(img, x, y);
}

/*  The update function checkes the value of the direction variable
*   which is updated in the handeInput function
*   and updates the row or column of the player. It is then rendered according to the changed ones.
*/

Player.prototype.update = function() {  
    if (direction == "0") {         //if direction is 0 it means the the user hasn't pressed any button so the position
        return;                     //is not updated
    }
    else {                          //else, I check the value of direction and act accordingly
        if (direction == "up") {                
            this.row--;
            direction = "0";
        }
        if (direction == "down") {
            this.row++;
            direction = "0";
        }
        if (direction == "left") {
            this.col--;
            direction = "0";
        }
        if (direction == "right") {
            this.col++;
            direction = "0";
        }
    }
    var img = new Image();
    img.src = this.sprite;
    ctx.drawImage(img, this.x, this.y);  //I render the player to his new position
}

/*  The handleInput function checks whether it is possible for the player to make a movement
*   if yes then it calls the player.update function
*   else it returns without doing anything
*   Also it checks whether the player won, and if yes I create new gems and the game starts over
*/  

Player.prototype.handleInput = function(evt) {
   if (evt == "up") {
        if (this.row == 1) {        //if I won I start over
            console.log("won");
            player.score = player.score + 500; //update score
            document.getElementById('myScore').innerHTML = player.score; 
            this.row = 5;
            this.col = 2;
            this.render();        //renders the player at start position
            for (i in allGems) {  //new gems  
                allGems[i].update(i);
            }
        }
        else {
            direction = "up";
        }           
    }
    if (evt == "down") {
        if (this.row == 5) {
            return;             
        }
        else {
            direction = "down";
        }           
    }
    if (evt == "left") {
        if (this.col == 0) {
            return;
        }
        else {
            direction = "left";
        }           
    } 
    if (evt == "right") {
        if (this.col == 4) {
            return;
        }
        else {
            direction = "right";
        }           
    }        
}

/*  The gems are in an array of 5 elements
*   I render the colors randomly, so they are different each time
*   when a player collects a gem, its value is added to his score and the gem disappears
*   If the player wins or looses I have 5 new gems
*/

var Gem = function(color, row, col) {
    this.sprite = 'images/Gem-' + color + '.png';  //link ths eikonas
    this.row = row;
    this.col = col;
    this.color = color;
    this.value = this.value();
}

//function to determine the value according to the gem's color

Gem.prototype.value = function() {
    if (this.color == "Orange") {
        return 300;
    }
    else if (this.color == "Blue") {
       return 200;
    }
    else {
       return 100;
    }
}

//rendering is similar to player

Gem.prototype.render = function() {
    var x, y;
    var img = new Image();
    img.src = this.sprite;
    x = this.col * 101 + 20;
    y = this.row * 78 + 40;
    ctx.drawImage(img, x, y, 70, 90);
}

//if the player looses I create new gems (is called from engine.js in a loop)

Gem.prototype.update = function(i) {
    row = Math.floor((Math.random() * 3) + 1);
    col = Math.floor((Math.random() * 5) + 0);
    var v = Math.floor((Math.random() * 3) + 0);  //epilegw tuxaia value ap ton pinaka values
    value = values[v];
    allGems[i] = new Gem(value, row, col);
}





var direction = 0;                              //string pou 8a periexei times up, down, left, right, 0. thn allazei h handleInput


var player = new Player();                  //instance of Player
var allEnemies; 
allEnemies = Array();
allEnemies.length = 3; 
var allGems;
allGems = Array();
allGems.length = 5;
var row, col, value;  
var values = ["Orange", "Blue", "Green"]; //the colors-values of gems

for (var i=0; i<allEnemies.length; i++) {        //array of enemies
    row = Math.floor((Math.random() * 3) + 1);
    allEnemies[i] = new Enemy(row);               //new enemy with row argument
} 

for (var i=0; i<allGems.length; i++) {          //array of values
    row = Math.floor((Math.random() * 3) + 1);
    col = Math.floor((Math.random() * 5) + 0);
    var v = Math.floor((Math.random() * 3) + 0);  //random value
    value = values[v];
    allGems[i] = new Gem(value, row, col);      //new gem with random value and position
}




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
