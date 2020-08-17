/**
 * Pokemon HTML5 canvas game
 */
window.onload = function() {
    'use strict';
  
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var w = document.getElementById('canvas').offsetWidth;
    var h = document.getElementById('canvas').offsetHeight;
    var terrainImageLoaded = false,
      pokeballImageLoaded = false, 
      playerImageLoaded = false;

    var objectSizes = 30;
    var speed = 100;
    var modifier = 100;
    var score = 0;

    //terrain image
    var terrainImage = new Image();
    terrainImage.onload = function() {
      terrainImageLoaded = true;
      assetsLoaded();
    };
    terrainImage.src = './ground.jpg';
  
    //player image
    var playerImage = new Image();
    playerImage.onload = function() {
      pokeballImageLoaded = true;
      assetsLoaded();
    };
    playerImage.src = './pokemon.png';
    
    //pokeball image
    var pokeballImage = new Image();
    pokeballImage.onload = function() {
      playerImageLoaded = true;
      assetsLoaded();
    };
    pokeballImage.src = './pokeball.png';
  
    /**
     * It will hold all the pockeball data like x and y axis position
     * sprite position and item distance is for determine which item is selected from the sprite 
     * Also hold the generate position function that generates random positions if there is no collision.
     */
    var pokeball = {
      x: 0,
      y: 0,
      spritePosition: 0,
    };

    pokeball.generatePosition = function() {

      do {
        pokeball.x = Math.floor(Math.random() * 38) + 1;
        pokeball.y = Math.floor(Math.random() * 16) + 1
      } while (check_collision(pokeball.x, pokeball.y));
  
      pokeball.spritePosition = Math.floor(Math.random() * 4) + 0; 
    };
  
    /**
     * Holds all the player's info like x and y axis position, his current direction (facing).
     * I have also included an object to hold the sprite position of each movement so i can call them
     * I also included the move function in order to move the player - all the functionality for the movement is in there
     */
    var player = {
      x: Math.round(w / 2 / objectSizes),
      y: Math.round(h / 2 / objectSizes)
    };

    player.move = function(direction) {
      /**
       * A temporary object to hold the current x, y so if there is a collision with the new coordinates to fallback here
       */
      var hold_player = {
        x: player.x,
        y: player.y,
      };
  
      /**
       * Decide here the direction of the user and do the necessary changes on the directions
       */
      switch (direction) {
        case 'left':
          player.x -= speed / modifier;
          break;

        case 'right':
          player.x += speed / modifier;
          break;

        case 'up':
          player.y -= speed / modifier;
          break;

        case 'down':
          player.y += speed / modifier;
          break;
      }
  
      /**
       * if there is a collision just fallback to the temp object i build before while not change back the direction so we can have a movement
       */
      if (check_collision(player.x, player.y)) {
        player.x = hold_player.x;
        player.y = hold_player.y;
      }
  
      /**
       * If player finds the coordinates of pokeball the generate new one
       */
      if (player.x == pokeball.x && player.y == pokeball.y) {
        // found a pokeball !! create a new one
        console.log('found a pokeball of ' + pokeball.spritePosition + '! Bravo! ');
        score += 1;
        pokeball.generatePosition();
      }
  
      update();
    };
  
    /**
     * Handle all the updates of the canvas and creates the objects
     */
    function update() {

      ctx.drawImage(terrainImage, 0, 0);
  
      //Genboard
      board();
  
      //pokeball
      ctx.drawImage(
        pokeballImage,
        pokeball.x * objectSizes,
        pokeball.y * objectSizes,
        objectSizes,
        objectSizes
      );
        
      //player
      console.log('y:', (player.y * objectSizes) / objectSizes);
      console.log('x', (player.x * objectSizes) / objectSizes);
      ctx.drawImage(
        playerImage,
        player.x * objectSizes,
        player.y * objectSizes,
        objectSizes,
        objectSizes
      );
    }
  
    /**
     * Our function that decides if there is a collision on the objects or not
     */
    function check_collision(x, y) {
      var foundCollision = false;
  
      if (
        x < 0  ||
        x > 24 ||
        y < 0  ||
        y > 16 ||
        x>21 && y>14
      ) {
        console.log('Age Boundary hai');
        foundCollision = true;
      }
      return foundCollision;
    }
  
    /**
     * Here we are creating our board on the bottom right with our score
     */
    function board() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(w - 100, h - 70, 100, 70);
  
      ctx.font = '18px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillText('You Found', w - 93, h - 45);
  
      ctx.font = '14px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillText(score + ' poketballs', w - 85, h - 25);
    }
  
    /**
     * Decide here if all the assets are ready to start updating
     */
    function assetsLoaded() {
      if (
        terrainImageLoaded == true &&
        pokeballImageLoaded == true &&
        playerImageLoaded == true
      ) {
        pokeball.generatePosition();
        update();
      }
    }
  
    /**
     * Assign of the arrow keys to call the player move
     */
    document.onkeydown = function(e) {
      e = e || window.event;
  
            if (e.keyCode == '37') player.move('left');
      else if (e.keyCode == '38') player.move('up');
      else if (e.keyCode == '39') player.move('right');
      else if (e.keyCode == '40') player.move('down');
    };
  };