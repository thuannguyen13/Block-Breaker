document.addEventListener('DOMContentLoaded', function () {

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');

    // ball setting
    var ballRadius = 10;
    var ballMoveX = Math.max(Math.random() * 10) + 2; // ball horizontal move value
    var ballMoveY = Math.max(Math.random() * 10) + 2; // ball vertical move value
    var ballX = canvas.width; // ball base X
    var ballY = canvas.height; // ball base Y
    // paddle setting
    var paddleHeight = 10;
    var paddleWidth = 100;
    var paddleX = canvas.width - paddleWidth;

    // bricks setting
    var brickRow = 5;
    var brickColumn = 6;
    var brickWidth = 100;
    var brickHeight = 20;
    var brickMargin = 2; // space between bricks
    var brickOffsetTop = 20; // space between bricks and the top edge of document
    var brickOffsetLeft = 20; // space between bricks and the left edge of document

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

    function mouseMoveHandler(event) {
        var cursorX = event.clientX;
        if (cursorX > 0 && cursorX < canvas.width) {
            paddleX = cursorX - paddleWidth / 2;
        }
    }

    // DRAW GAME ELEMENTS

    function drawGameBoard() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        for (var c = 0; c < brickColumn; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRow; r++) {
                bricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1
                };
            }
        }
    }

    function drawBricks() {
        for (var c = 0; c < brickColumn; c++) {
            for (var r = 0; r < brickRow; r++) {
                if (bricks[c][r].status == 1) {
                    var bricksX = (c * (brickWidth * brickMargin) + brickOffsetLeft);
                    var bricksY = (r * (brickHeight * brickMargin) + brickOffsetTop);
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

    function drawBall() {
        ballX += ballMoveX;
        ballY += ballMoveY;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
        ctx.closePath();
    }

    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2);
    }

    function drawLives() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('Live: ' + lives, canvas.width / 2, (canvas.height / 2) + 20);
    }

    function collisionDetection() {
        // for brick
        for (c = 0; c < brickColumn; c++) {
            for (r = 0; r < brickRow; r++) {
                var br = bricks[c][r];
                if (br.status == 1) {
                    if (ballX > br.x && ballX < br.x + brickWidth &&
                        ballY > br.y && ballY < br.y + (brickHeight + ballRadius)) {
                        ballMoveY = -ballMoveY;
                        br.status = 0;
                        score += 10;
                        if (score == (brickColumn * brickRow) * 10) {
                            alert('You WON!');
                            document.location.reload();
                        }
                    }
                }
            }
        }

        // ball collision for left and right side
        if (ballX + ballMoveX < ballRadius || ballX + ballMoveX > canvas.width - ballRadius) {
            ballMoveX = (Math.atan2(ballMoveY, paddleX) * (Math.PI / 180)) + (-ballMoveX);
        }

        // ball collision for top side
        if (ballY + ballMoveY < ballRadius) {
            ballMoveY = -ballMoveY;
        }

        // paddle collision detection
        if (paddleX <= 0) {
            paddleX = 0;
        } else if (paddleX >= canvas.width - paddleWidth) {
            paddleX = canvas.width - paddleWidth;
        }

        // between paddle, ball, display board
        if (ballY + ballMoveY > canvas.height - (ballRadius + paddleHeight)) {
            if (paddleX <= ballX && ballX <= paddleX + paddleWidth) {
                ballMoveY = -ballMoveY;
            } else {
                lives--;
                if (!lives) { // return faulty
                    alert('GAME OVER!');
                    document.location.reload();
                } else {
                    ballX = (paddleX + paddleWidth) / 2;
                    ballY = canvas.height - 30;
                    ballMoveX = 5;
                    ballMoveY = -5;
                }
            }
        }

        // ballX > paddleX && ballX < paddleX + paddleWidth

    }

});
