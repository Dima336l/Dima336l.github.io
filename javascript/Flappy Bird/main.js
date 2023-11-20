// Canvas setup

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 400;

// Declaring global var
let spaceKeyPressed = false;
let angle = 0; // Used for bird animation when static
let hue = 0; // Variable for cycling through colors for particle effect
let frame = 0; // Keep track of frame count
let score = 0;
let gameSpeed = 2;

const gradient = ctx.createLinearGradient(0, 0, 0, 70);
gradient.addColorStop("0.4", "#fff");
gradient.addColorStop("0.5", "#000");
gradient.addColorStop("0.55", "#4040ff");
gradient.addColorStop("0.6", "#000");
gradient.addColorStop("0.9", "#fff");

const background = new Image();

background.src = "../../images/flappybird images/BG.png";
const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

function handleBackground() {
  if (BG.x1 <= -BG.width + gameSpeed) {
    BG.x1 = BG.width;
  } else {
    BG.x1 -= gameSpeed;
  }
  if (BG.x2 <= -BG.width + gameSpeed) {
    BG.x2 = BG.width;
  } else {
    BG.x2 -= gameSpeed;
  }
  ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillRect(10,canvas.height-90,50,50);
  handleBackground();
  handleObstacles();
  bird.update();
  bird.draw();
  ctx.fillStyle = gradient;
  ctx.font = "90px Georgia";
  ctx.strokeText(score, 450, 70);
  ctx.fillText(score, 450, 70);
  if (handleCollisions()) return;
  handleParticles();
  requestAnimationFrame(animate); // Calling the animate function recursively
  angle += 0.12;
  hue++;
  frame++;
}
animate();

window.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    spaceKeyPressed = true;
  }
});

window.addEventListener("keyup", function (e) {
  if (e.code === "Space") {
    spaceKeyPressed = false;
  }
});

const bang = new Image();
bang.src = "../../images/flappybird images/bang.png";

function handleCollisions() {
  for (let i = 0; i < obstaclesArray.length; i++) {
    if (
      bird.x < obstaclesArray[i].x + obstaclesArray[i].width &&
      bird.x + bird.width > obstaclesArray[i].x &&
      ((bird.y < 0 + obstaclesArray[i].top && bird.y + bird.height > 0) ||
        (bird.y > canvas.height - obstaclesArray[i].bottom &&
          bird.y + bird.height < canvas.height))
      //   Collision detected
    ) {
      ctx.drawImage(bang, bird.x, bird.y, 50, 50);
      ctx.font = "25px Georgia";
      ctx.fillStyle = "black";
      ctx.fillText(
        "Game Over, your score is " + score,
        200,
        canvas.height / 2 + 10
      );
      return true;
    }
  }
}
