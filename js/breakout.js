/**
* Built using the "2D Breakout Game Using Pure JavaScript" tutorial on the Mozilla Developer Network
* https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
*
* TODO: Break file into partials and compile on build for better organization
*/

/** Canvas */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/** Ball */
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var maximumBallSpeed = 7;
var ballSpeedModifier = 0.41666;

/** Paddle */
var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

/** User Interface */

var fillStyleColor = "#0095DD";
var score = 0;
var lives = 3;

/** Adding brick variables */
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];

for (column = 0; column < brickColumnCount; column++) {
  bricks[column] = [];

  for (row = 0; row < brickRowCount; row++) {
    bricks[column][row] = { x: 0, y: 0, status: 1 };
  }
}

/** Keyboard Event Listeners */
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == '39') {
    rightPressed = true;
  } else if (e.keyCode == '37') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == '39') {
    rightPressed = false;
  } else if (e.keyCode == '37') {
    leftPressed = false;
  }
}

/**
* Mouse Event Listeners
* TODO:
* Adjust the boundaries of the paddle movement, so the whole paddle will be visible on both edges of the Canvas instead of only half of it.
* Allow user to choose input method at start of game!
*/

/**
document.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
*/

/** Determine if the ball has collided with any of the bricks at the top of the screen */
function brickCollisionDetection() {
  for (column = 0; column < brickColumnCount; column++) {
    for (row = 0; row < brickRowCount; row++) {
      var brick = bricks[column][row];
      if (brick.status == 1) {
        if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
          increaseBallSpeed();
          dy = -dy;
          brick.status = 0;
          score++;

          fillStyleColor = generateRandomColor();

          if (score == brickRowCount * brickColumnCount) {
            alert('You win! Final score: ' + score);
            document.location.reload();
          }
        }
      }
    }
  }
}

function canvasCollisionDetection() {
  /** Check to see if the ball has collided with the top edge of the canvas */
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    /** Check to see if the ball is touching the bottom edge of the canvas or the paddle */
    if (x > paddleX && x < paddleX + paddleWidth) {
      /**
      * TODO: Make ball ricochet in different angles depending on where the ball collides with the paddle
      */
      dy = -dy;
    } else {
      lives--;

      if (!lives) {
        gameOver();
      } else {
        /** reset the ball and paddle to their starting locations */
        x = canvas.width / 2;
        y = canvas.height - 30;
        Math.abs(dx);
        -Math.abs(dy);
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  /** Check to see if the ball has collided with the left or right edges of the canvas */
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  /** Change paddle positions if the player is moving the paddle with the keyboard or mouse */
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}

/** Run the end game state */
function gameOver() {
  alert('Game Over!');
  document.location.reload();
}

/** Increase ball speed until it reaches maximum ball speed */
function increaseBallSpeed() {
  if (dx > 0 && dx < maximumBallSpeed) {
    dx += ballSpeedModifier;
  } else if (dx < 0 && dx > -maximumBallSpeed) {
    dx -= ballSpeedModifier;
  }

  if (dy > 0 && dy < maximumBallSpeed) {
    dy += ballSpeedModifier;
  } else if (dy < 0 && dy > -maximumBallSpeed) {
    dy -= ballSpeedModifier;
  }
}

/**
* Render the ball on the canvas in its new location
* ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
* https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
*/
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = fillStyleColor;
    ctx.fill();
    ctx.closePath();
}

/**
* Render the paddle in its specified location on the canvas
* ctx.rect(x, y, width, height);
* https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect
*/
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = fillStyleColor;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (column = 0; column < brickColumnCount; column++) {
    for (row = 0; row < brickRowCount; row++) {
      if(bricks[column][row].status == 1) {
        var brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[column][row].x = brickX;
        bricks[column][row].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function generateRandomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clearCanvas();
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  brickCollisionDetection();
  canvasCollisionDetection();

  requestAnimationFrame(draw);
}

draw();
