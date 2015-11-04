
/* The Engine has 3 states. The start state, the running state and the game over state. 
*  In the render function I have a switch which takes care of the current state.
*  I change between states with 2 event handlers at the enc of the Engine.
*/

var currentState = "Start";  //starting state of the game 

var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

     
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }


    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);


    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        switch (currentState) {
            case "Running":
                updateEntities(dt);
                checkCollisions();
                break;
        }
    }

    /* I use a checkCollisions function which checks whether the player collided with a bug 
    * or collected a gem
     */

    function checkCollisions() {
        for (i in allEnemies) {
            if (allEnemies[i].time >= allEnemies[i].start) { //if the bug is on screen
                var col;
                if (allEnemies[i].x < 20) {                     //I check in which column it is
                    col = 0;
                }
                else if (allEnemies[i].x < 121) { 
                    col = 1;
                }
                else if (allEnemies[i].x < 221) {
                    col = 2;
                } 
                else if (allEnemies[i].x < 321) {
                    col = 3; 
                }
                else {
                    col = 4; 
                }                
                if (col == player.col && allEnemies[i].row == player.row) {     //and then if the player is on the same row and column
                    player.row = 5;             //the player looses and goes at the start
                    player.col = 2;
                    player.life--;          //he looses a life
                    player.score = player.score - 500;  //new score
                    console.log(player.score);
                    if (player.life == 0) { //if he has 0 lives -> game over state
                        currentState = "Game Over";
                        for (var i=0; i<allGems.length; i++) {  //new gems for the next game
                            allGems[i].update(i);
                        }
                        return;
                    }
                    document.getElementById('myLives').innerHTML = player.life; //else I update the lives and score divs
                    document.getElementById('myScore').innerHTML = player.score;
                    player.render();
                    //if the player looses I create brand new gems
                    for (var i=0; i<allGems.length; i++) {
                        allGems[i].update(i);
                    }
                }
            }
        }
        for (i in allGems) {    //if the player collects a gem
            if(allGems[i].col == player.col && allGems[i].row == player.row) { //the value of the gem is added to his score
                player.score = player.score + allGems[i].value;
                document.getElementById('myScore').innerHTML = player.score;
                allGems[i].sprite = '';      //and the gem itself is no longer visible
                allGems[i].col = -1;
                allGems[i].row = -1;
            }
        }
    }
     
    function updateEntities(dt) {  //I update the location of enemies and player. My enemy.update functions takes as argument the i of the allEnemies table
        for (i in allEnemies) {
            allEnemies[i].update(dt, i);
        }
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

 
    function render() {                             
        /* This array holds the relative URL to the image used      
         * for that particular row of the game level.
         */
        console.log(currentState);  
        switch (currentState) {                     //I check the current state
            case "Running":             //if I am in the game I render the correct background and the entities
                document.getElementById('gameStats').style.display = 'block';  //I make the gameStats div appear
                document.getElementById('topScore').innerHTML = "Your score:";
                document.getElementById('myScore').innerHTML = player.score;
                document.getElementById('lives').style.display = 'block';
                document.getElementById('myLives').innerHTML = player.life;
                document.getElementById('description').style.display = 'none';  //and I hide the descriptions div
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, 53);
                ctx.fillRect(0, canvas.height - 30, canvas.width, canvas.height);
                var rowImages = [
                        'images/water-block.png',   // Top row is water
                        'images/stone-block.png',   // Row 1 of 3 of stone
                        'images/stone-block.png',   // Row 2 of 3 of stone
                        'images/stone-block.png',   // Row 3 of 3 of stone
                        'images/grass-block.png',   // Row 1 of 2 of grass
                        'images/grass-block.png'    // Row 2 of 2 of grass
                    ],
                    numRows = 6,
                    numCols = 5,
                    row, col;

                /* Loop through the number of rows and columns we've defined above
                 * and, using the rowImages array, draw the correct image for that
                 * portion of the "grid"
                 */
                for (row = 0; row < numRows; row++) {
                    for (col = 0; col < numCols; col++) {
                        /* The drawImage function of the canvas' context element
                         * requires 3 parameters: the image to draw, the x coordinate
                         * to start drawing and the y coordinate to start drawing.
                         * We're using our Resources helpers to refer to our images
                         * so that we get the benefits of caching these images, since
                         * we're using them over and over.
                         */
                        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);      //width:101, height: 83 kai 8esh analoga me thn row/col pou eimaste
                    }
                }
                //afou ftia3w to background, ftiaxnw tis entities

                renderEntities();
                break;
            case "Start":           //if the current state is start I call the proper render function
                renderStartScreen();
                break;
            case "Game Over":       //I do the same if the state is game over
                renderGameOverScreen();
                break;
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */

    function renderStartScreen() {          //this function renders the start screen, in which the user can choose his player (through click event)
        ctx.fillStyle = '#5EC4AB';          //to start the game the user must press enter
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.StrokeStyle = 'black';
        ctx.font = 'bold 35px "Gorditas", cursive';
        ctx.textAlign = "center";
        var header = "Frogger Arcade Game";
        var character = "Choose you character:";
        var start = "Press ENTER to start!";
        ctx.fillText(header, canvas.width/2, 40);
        ctx.strokeText(header, canvas.width/2, 40);
        ctx.fillText(character, canvas.width/2, 150);
        ctx.strokeText(character, canvas.width/2, 150);
        ctx.fillText(start, canvas.width/2, canvas.height - 40);
        ctx.strokeText(start, canvas.width/2, canvas.height - 40);
        var player1, player2, player3, player4, player5;
        player1 = new Image(100, 100);
        player1.src = 'images/char-boy.png';
        ctx.drawImage(player1, 50, 150);
        player2 = new Image(100, 100);
        player2.src = 'images/char-cat-girl.png';
        ctx.drawImage(player2, 200, 150);
        player3 = new Image(100, 100);
        player3.src = 'images/char-horn-girl.png';
        ctx.drawImage(player3, 350, 150);
        player4 = new Image(100, 100);
        player4.src = 'images/char-pink-girl.png';
        ctx.drawImage(player4, 100, 300);
        player5 = new Image(100, 100);
        player5.src = 'images/char-princess-girl.png';
        ctx.drawImage(player5, 300, 300);
    }

    function renderGameOverScreen() {       //this is the game over screen
        ctx.fillStyle = '#5EC4AB';          //works almost the same way with the start screen
        ctx.fillRect(0, 0, canvas.width, canvas.height);   //the user can start to play immediately (enter) or choose a different player (space)
        ctx.fillStyle = 'white';
        ctx.StrokeStyle = 'black';
        ctx.font = 'bold 50px "Gorditas", cursive';
        ctx.textAlign = "center";
        var header = "GAME OVER";
        ctx.fillText(header, canvas.width / 2, canvas.height/3);
        ctx.strokeText(header, canvas.width / 2, canvas.height/3);
        ctx.font = 'bold 35px "Gorditas", cursive';
        var footer = "Press SPACE to go to Screen";
        var footer2 = "Or ENTER to play again";
        ctx.fillText(footer, canvas.width / 2, canvas.height - 100);
        ctx.strokeText(footer, canvas.width / 2, canvas.height - 100);
        ctx.fillText(footer2, canvas.width / 2, canvas.height - 50);
        ctx.strokeText(footer2, canvas.width / 2, canvas.height - 50);
        document.getElementById('topScore').innerHTML = "Your highest score is:";
        document.getElementById('myScore').innerHTML = player.score;
        document.getElementById('lives').style.display = 'none';
     }


    function renderEntities() {    //renders the entities
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */

        for (i in allEnemies)  { 
            allEnemies[i].render();
        }

        player.render();

        for (i in allGems) {
            allGems[i].render();
        }
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }


    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);

var choosePlayer = function(evt) {     //this is the functions that handles the click event for the player choice
    //i change each time the player.sprite to the appropriate
    if (event.pageY >= 300 && event.pageY < 400) {  //first row of characters
        if (event.pageX >= 600 && event.pageX < 700 ){  //first character
            console.log("first");
            player.sprite = 'images/char-boy.png';
        }
        if (event.pageX >= 750 && event.pageX < 850 ){  //second character
            console.log("second");
            player.sprite = 'images/char-cat-girl.png';
        }
        if (event.pageX >= 900 && event.pageX < 1000 ){  //third character
            console.log("third"); 
            player.sprite = 'images/char-horn-girl.png';
        }
    }
    if (event.pageY >= 440 && event.pageY < 550) {  //second row of characters
       if (event.pageX >= 650 && event.pageX < 750 ){  //first character
            console.log("fourth");
            player.sprite = 'images/char-pink-girl.png';
        }
        if (event.pageX >= 850 && event.pageX < 950 ){  //first character
            console.log("fifth");
            player.sprite = 'images/char-princess-girl.png';
        } 
    }
}

var gameLaunch = function(evt) {    //start the game with enter
    if (evt == 13) {
        var currentState = "Running";
        console.log(currentState);
    }    
}

/*My event listeners:
* choose player
* start game
* go to start screen
*/
document.addEventListener('click', choosePlayer, false);

window.addEventListener( 'keyup', function(e) {
    if (e.keyCode == 13) {
        currentState = "Running";
        player.score = 0;
        player.life = 3;
    }    
});

window.addEventListener( 'keyup', function(e) {
    if (e.keyCode == 32) {
        currentState = "Start";
        player.lives = 3;
        document.getElementById('gameStats').style.display = 'none';
        document.getElementById('description').style.display = 'block';
        player.score = 0;
        player.life = 3;
    }    
});
