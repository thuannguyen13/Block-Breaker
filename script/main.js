var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

// update Draw()
var DRAW_SPEED = 10;

setInterval(draw, DRAW_SPEED);

var x = canvas.width / 2; // make object centered
var y = canvas.height - 50;

// ball setting
var ballRadius = 10;
var dx = 2;
var dy = -2;

// paddle setting
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight;
var paddleMoveLeft = false;
var paddleMoveRight = false;

// bricks setting
var brickRow = 3;
var brickColumn = 5;
var brickWidth = 100;
var brickHeight = 20;
var brickPadding = 2;
var brickOffsetTop = 20;
var brickOffsetLeft = 20;

// score
var score = 0;

var bricks = [];
for (var c = 0; c < brickColumn; c++){
  bricks[c] = [];
  for (var r = 0; r < brickRow; r++){
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}


// KEYBOARD AND MOUSE HANDLER
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

function mouseMoveHandler(event){
  var cursorX = event.clientX;
  if(cursorX > 0 && cursorX < canvas.width){
    paddleX = cursorX - paddleWidth / 2;
  }
}

function keyDownHandler(event) {
  if(event.keyCode == 39){
    paddleMoveRight = true;
  }else if (event.keyCode == 37){
    paddleMoveLeft = true;
  }
}

function keyUpHandler() {
  paddleMoveRight = false;
  paddleMoveLeft = false;
}

// DRAW GAME ELEMENTS

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  collisionDetection();
  drawBricks();
  drawScore();
  x += dx;
  y += dy;
  if(paddleMoveRight == true){
    paddleX += 5;
  }else if(paddleMoveLeft == true){
    paddleX -= 5;
  }
}

function drawBricks() {
  for(var c = 0; c < brickColumn; c++ ){
    for(var r = 0; r < brickRow; r++){
      if(bricks[c][r].status == 1){
        var bricksX = (c * (brickWidth * brickPadding)) + brickOffsetLeft;
        var bricksY = (r * (brickHeight * brickPadding)) + brickOffsetTop;
        bricks[c][r].x = bricksX;
        bricks[c][r].y = bricksY;
        ctx.beginPath();
        ctx.rect(bricksX, bricksY, brickWidth, brickHeight);
        ctx.fillStyle = '#0000ff';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#ff0000';
  ctx.fill();
  ctx.closePath();
}

function drawScore(){
  ctx.font = '16px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText('Score: ' + score, 8 , 20);
}

function collisionDetection(){

  // for brick
  for(c = 0; c < brickColumn; c++){
    for(r = 0; r< brickRow; r++){
      var b = bricks[c][r];
      if(b.status ==1 ){
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + (brickHeight + ballRadius)){
          dy = -dy;
          b.status = 0;
          score += 10;
          if(score == (brickColumn * brickRow)*10){
            alert('You WON!');
          }
        }
      }
    }
  }
  // for game box
  if(y + dy <ballRadius){
    dy = -dy;
  }else if( y + dy > canvas.height - (ballRadius + paddleHeight)){
    if(x > paddleX && x < paddleX + paddleWidth){
      dy = -dy;
    }else {
      document.location.reload();
    }
  }

  if(x + dx <ballRadius || x + dx > canvas.width - ballRadius){
    dx = -dx;
  }

  // for paddle

  if(paddleX <= 0 ){
    paddleX =  0 ;
  }else if(paddleX >= canvas.width - paddleWidth){
    paddleX = canvas.width - paddleWidth;
  }
}
