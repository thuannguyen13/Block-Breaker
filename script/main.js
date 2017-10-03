document.addEventListener('DOMContentLoaded', function(){

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');

  var canWidth = canvas.width;
  var canHeight = canvas.height;

  // ball setting
  var ballRadius = 10;
  var ballX = 5; // ball horizontal position
  var ballY = 5; // ball vertical position

  // paddle setting
  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = canvas.width - paddleWidth;

  // bricks setting
  var brickRow = 5;
  var brickColumn = 6;
  var brickWidth = 100;
  var brickHeight = 20;
  var brickMargin = 2;
  var brickOffsetTop = 20;
  var brickOffsetLeft = 20;

  // score
  var score = 0;
  var lives = 3;

  // bricks template
  var bricks = [];

  drawGameBoard();
  generateBrick();
  update();


  // KEYBOARD AND MOUSE HANDLER
  window.addEventListener('resize', drawGameBoard);
  document.addEventListener('mousemove', mouseMoveHandler);

  function mouseMoveHandler(event){
    var cursorX = event.clientX;
    if(cursorX > 0 && cursorX < canvas.width){
      paddleX = cursorX - paddleWidth / 2;
    }
  }

  // DRAW GAME ELEMENTS

  function drawGameBoard() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function update() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();
    drawBricks();
    drawScore();
    drawLives();
    requestAnimationFrame(update);
  }

  // generate brick template
  function generateBrick() {
    for (var c = 0; c < brickColumn; c++){
      bricks[c] = [];
      for (var r = 0; r < brickRow; r++){
        bricks[c][r] = {x: 0, y: 0, status: 1};
      }
    }
  }

  function drawBricks() {
    for(var c = 0; c < brickColumn; c++ ){
      for(var r = 0; r < brickRow; r++){
        if(bricks[c][r].status == 1){
          var bricksX = (c * (brickWidth * brickMargin)) + brickOffsetLeft;
          var bricksY = (r * (brickHeight * brickMargin)) + brickOffsetTop;
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
    canWidth += ballX;
    canHeight += ballY;
    ctx.beginPath();
    ctx.arc(canWidth, canHeight, ballRadius, 0, Math.PI * 2, false);
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
    ctx.fillText('Score: ' + score, canvas.width / 2 , canvas.height / 2);
  }

  function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Live: ' + lives, canvas.width / 2 , (canvas.height / 2) + 20);
  }

  function collisionDetection(){
    // for brick
    for(c = 0; c < brickColumn; c++){
      for(r = 0; r < brickRow; r++){
        var b = bricks[c][r];
        if(b.status == 1 ){
          if(canWidth > b.x && canWidth < b.x + brickWidth &&
            canHeight > b.y && canHeight < b.y + (brickHeight + ballRadius)){
            ballY = -ballY;
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
    if(canHeight + ballY < ballRadius){
      ballY = -ballY;
    }else if( canHeight + ballY > canvas.height - (ballRadius + paddleHeight)){
      if(canWidth > paddleX && canWidth < paddleX + paddleWidth){
        ballY = -ballY;
      }else {
        lives--;
        if(!lives){
          alert('GAME OVER!');
          document.location.reload();
        } else {
          canWidth = canvas.width / 2;
          canHeight = canvas.height - 30;
          ballX = 5;
          ballY = -5;
        }
      }
    }

    // ball collision detection
    if(canWidth + ballX <ballRadius || canWidth + ballX > canvas.width - ballRadius){
      ballX = -ballX;
    }

    // paddle collision detection
    if(paddleX <= 0 ){
      paddleX =  0 ;
    }else if(paddleX >= canvas.width - paddleWidth){
      paddleX = canvas.width - paddleWidth;
    }
  }

});
