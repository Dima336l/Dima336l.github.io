// Canvas initialization
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 400;

class Game {
  constructor() {
    this.bird = new Bird(this);
    this.gradient = ctx.createLinearGradient(0, 0, 0, 70);
    this.gradient.addColorStop("0.4", "#fff");
    this.gradient.addColorStop("0.5", "#000");
    this.gradient.addColorStop("0.55", "#4040ff");
    this.gradient.addColorStop("0.6", "#000");
    this.gradient.addColorStop("0.9", "#fff");
    this.background = new Image();
    this.background.src = "./images/flappybird images/BG.png";
    this.heart = new Image();
    this.heart.src = "./images/flappybird images/heart.png";
    this.heartHeight = 500;
    this.heartWidth = 500;
    this.backgroundConfig = {
      x1: 0,
      x2: canvas.width,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    };
    this.isAudioPlaying = false;
    this.score = 0;
    this.angle = 0;
    this.gameSpeed = 2;
    this.spaceKeyPressed = false;
    this.frame = 0;
    this.hue = 0;
    this.obstacle = new Obstacles(this, this.bird);
    this.particle = new Particle(this, this.bird);
    this.gameLoop();
  }

  // Main game function
  gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.handleBackground();
    this.obstacle.handleObstacles();
    this.drawLives();
    this.bird.update();
    this.handleScore();
    if (this.obstacle.handleCollision()) {
      return;
    }
    this.particle.handleParticles();
    requestAnimationFrame(() => this.gameLoop());
    this.angle += 0.12;
    this.hue++;
    this.frame++;
  }

  handleScore() {
    ctx.fillStyle = this.gradient;
    ctx.font = "90px Goergia";
    ctx.strokeText(this.score, 450, 70);
    ctx.fillText(this.score, 450, 70);
  }

  handleBackground() {
    if (
      this.backgroundConfig.x1 <=
      -this.backgroundConfig.width + this.gameSpeed
    ) {
      this.backgroundConfig.x1 = this.backgroundConfig.width;
    } else {
      this.backgroundConfig.x1 -= this.gameSpeed;
    }
    if (
      this.backgroundConfig.x2 <=
      -this.backgroundConfig.width + this.gameSpeed
    ) {
      this.backgroundConfig.x2 = this.backgroundConfig.width;
    } else {
      this.backgroundConfig.x2 -= this.gameSpeed;
    }
    ctx.drawImage(
      this.background,
      this.backgroundConfig.x1,
      this.backgroundConfig.y,
      this.backgroundConfig.width,
      this.backgroundConfig.height
    );
    ctx.drawImage(
      this.background,
      this.backgroundConfig.x2,
      this.backgroundConfig.y,
      this.backgroundConfig.width,
      this.backgroundConfig.height
    );
  }

  playSound(sound) {
    if (this.isAudioPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio = new Audio(sound);
    this.audio.addEventListener("canplaythrough", () => {
      this.audio.play();
    });
    this.audio.addEventListener("ended", () => {
      this.isAudioPlaying = false;
    });
  }
  drawLives() {
    for (let i = 0; i < this.bird.lives; i++) {
      ctx.drawImage(
        this.heart,
        50 * i,
        0,
        this.heartHeight / 10,
        this.heartHeight / 10
      );
    }
  }
}

class Bird {
  constructor(game) {
    this.game = game;
    this.x = 100;
    this.y = 200;
    this.velocity = 0;
    this.weight = 1;
    this.imageWidth = 547;
    this.imageHeight = 456;
    this.width = 20;
    this.height = 20;
    this.flappAllowed = true;
    this.lastFlapTime = 0;
    this.lives = 3;
    this.character = new Image();
    this.character.src = "./images/flappybird images/ghostCharacter.png";

    // Key press event handling
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && this.flappAllowed && this.y > this.height * 3) {
        this.flap();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        this.game.spaceKeyPressed = false;
        this.flappAllowed = true; // Var for state
      }
    });
  }

  update() {
    let curve = Math.sin(this.game.angle) * 20; // Used to generate a slight upwards and downwards movement when static similar to flapping
    if (this.y > canvas.height - this.height * 5 - curve) {
      // Make sure bird doesn't fall below canvas
      this.y = canvas.height - this.height * 5 - curve;
    }

    if (this.y < 0 + this.height) {
      // Make sure bird doesn't go above canvas
      this.y = 0 + this.height;
    }

    if (this.y <= canvas.height - this.height - curve) {
      // If bird within boundaries
      this.velocity += this.weight; // Gravity simulation
      this.velocity *= 0.8; // Damping effect
      this.y += this.velocity;
    }

    this.draw();
  }

  draw() {
    ctx.drawImage(
      this.character,
      0,
      0,
      this.imageWidth,
      this.imageHeight,
      this.x - 50,
      this.y - 40,
      this.imageWidth / 4,
      this.imageHeight / 4
    );
  }

  flap() {
    const currentTime = Date.now();
    this.game.spaceKeyPressed = true;
    this.velocity -= 30;
    this.flappAllowed = false; // State handling
    this.lastFlapTime = currentTime;

    if (this.audio) {
      this.audio.currentTime = 0;
    } else {
      this.audio = new Audio("./audio/flap.mp3");
    }
    this.audio.play();
  }
}

class Obstacles {
  constructor(game, bird) {
    this.game = game;
    this.bird = bird;
    this.top = (Math.random() * canvas.height) / 3 + 20;
    this.bottom = (Math.random() * canvas.height) / 3 + 20;
    this.x = canvas.width;
    this.width = 20;
    this.color = "hsla(" + this.game.hue + ",100%,50%,1)";
    this.counted = false;
    this.lifeDecreased = false;
    this.obstacleArr = [];
    this.bang = new Image();
    this.bang.src = "../images/flappybird images/bang.png";
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, 0, this.width, this.top);
    ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
  }
  update() {
    this.x -= this.game.gameSpeed;
    if (!this.counted && this.bird && this.x < this.bird.x) {
      this.game.playSound("../audio/point.mp3");
      this.game.score++;
      this.counted = true; // Flag so we dont keep counting the same obstacle
    }
    this.draw();
  }
  handleObstacles() {
    this.x -= this.game.gameSpeed;
    if (this.game.frame % 150 === 0) {
      // Spawn obstacle every 150 frame
      this.obstacleArr.unshift(new Obstacles(this.game, this.bird));
    }
    for (let i = 0; i < this.obstacleArr.length; i++) {
      this.obstacleArr[i].update(); // Draw the obstacle
    }
    if (this.obstacleArr.length > 20) {
      this.obstacleArr.pop(this.obstacleArr[0]); // Pop from array so no memory overload
    }
  }
  detectCollision() {
    for (let i = 0; i < this.obstacleArr.length; i++) {
      if (this.bird) {
        if (
          this.bird.x < this.obstacleArr[i].x + this.obstacleArr[i].width &&
          this.bird.x + this.bird.width > this.obstacleArr[i].x &&
          ((this.bird.y < 0 + this.obstacleArr[i].top &&
            this.bird.y + this.bird.height > 0) ||
            (this.bird.y > canvas.height - this.obstacleArr[i].bottom &&
              this.bird.y + this.bird.height < canvas.height))
        ) {
          if (!this.lifeDecreased) {
            this.bird.lives--;
            this.lifeDecreased = true;
          }
          return true;
        }
      }
    }
  }
  handleCollision() {
    if (this.detectCollision()) {
      if (this.bird.lives === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.game.handleBackground();
        this.handleObstacles();
        this.game.playSound("../audio/bang.mp3");
        ctx.drawImage(this.bang, this.bird.x, this.bird.y - 20, 100, 100);
        ctx.font = "25px Georgia";
        ctx.fillStyle = "white";
        ctx.fillText(
          "Game over, your score is " + this.game.score,
          200,
          canvas.height / 2 + 10
        );
        return true;
      }
    } else {
      this.lifeDecreased = false;
    }
  }
}

class Particle {
  constructor(game, bird) {
    this.game = game;
    this.bird = bird;
    this.x = this.bird.x;
    this.y = this.bird.y;
    this.particleArr = [];
    this.size = Math.random() * 7 + 3;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = "hsla(" + this.game.hue + ",100%,50%, 0.8)";
  }
  update() {
    this.x -= this.game.gameSpeed;
    this.y += this.speedY;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  handleParticles() {
    this.particleArr.unshift(new Particle(this.game, this.bird));
    for (let i = 0; i < this.particleArr.length; i++) {
      this.particleArr[i].update();
      this.particleArr[i].draw();
    }
    if (this.particleArr.length > 200) {
      this.particleArr.splice(180, 200);
    }
  }
}

const game = new Game();
