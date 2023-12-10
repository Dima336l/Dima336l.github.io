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
    this.background1 = new Image();
    this.background2 = new Image();
    this.background3 = new Image();
    this.heart = new Image();
    this.shield = new Image();
    this.jetpack = new Image();
    this.coin = new Image();
    this.light = new Image();
    this.doublePoints = new Image();
    this.small = new Image();
    this.globe = new Image();
    this.pipeRow = 0;
    this.pipeCol = 0;
    this.imageNum = 0;
    this.imgArr = [this.background2,this.background1,this.background3];
    this.doublePoints.src = "../images/flappybird images/Score Multiplier.png";
    this.light.src = "../images/flappybird images/Lighting.png";
    this.background.src = "../images/flappybird images/BG.png";
    this.background1.src = "../images/flappybird images/Background1.png"
    this.background2.src = "../images/flappybird images/Background2.png"
    this.background3.src = "../images/flappybird images/Background3.png"
    this.heart.src = "../images/flappybird images/heart.png";
    this.shield.src = "../images/flappybird images/Shield.png";
    this.jetpack.src = "../images/flappybird images/Jetpack.png";
    this.coin.src = "../images/flappybird images/Coin.png";
    this.small.src = "../images/flappybird images/Small.png";
    this.globe.src = "../images/flappybird images/Globe.png";
    this.powerUpTypes = [
      "heart",
      "doublePoints",
      "lighting",
       "shield",
      "small",
      "coin",
      "globe",
    ];
    this.gapSize = 250;
    this.powerUpHeight = 500;
    this.powerUpWidth = 500;
    this.speedMultiplier = 0;
    this.deactivateCollision = false;
    this.isGravityActive = false;
    this.islightingActive = false;
    this.isSmallPowerUpActive = false;
    this.isShieldActive = false;
    this.gameStarted = false;
    this.powerUpSpawned = false;
    this.increasedDifficulty = false;
    this.imageChanged = false;
    this.backgroundConfig = {
      x1: 0,
      x2: canvas.width,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    };
    this.isAudioPlaying = false;
    this.spaceKeyPressed = false;
    this.gameOver = false;
    this.coinShifted = false;
    this.score = 0;
    this.angle = 0;
    this.gameSpeed = 2;
    this.frame = 0;
    this.hue = 0;
    this.scoreBonus = 0;
    this.scaleDown = 4.5;
    this.scaleFactor = 1;
    this.jetpackScaleDown = 4;
    this.offSetX = 0;
    this.offSetY = 0;
    this.offSetXJetpack = 0;
    this.offSetYJetpack = 0;
    this.powerUp = null;
    this.obstacle = new Obstacles(this, this.bird);
    this.particle = new Particle(this, this.bird);
    this.powerUp = null;
    this.coinArr = [];
    this.gameLoop();
  }

  // Main game function
  gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.handleBackground();
    this.obstacle.handleObstacles();
    this.drawLives();
    this.handlePowerUp();
    this.drawShield();
    this.drawJetpack();
    this.bird.update();
    this.handleScore();
    this.increaseDifficulty();
    if (!this.deactivateCollision) {
      if (this.obstacle.handleCollision()) {
        if (this.bird.lives === 0) {
          this.updateScore();
          this.gameOver = true;
          this.restartGame();
        }
        return;
      }
    }
    this.particle.handleParticles();
    requestAnimationFrame(() => this.gameLoop());
    this.angle += 0.12;
    this.hue++;
    this.frame++;
  }

  increaseDifficulty() {
    if (this.score % 50 === 0 && this.score > 0 && !this.increasedDifficulty) {
      if (this.obstacle.spawnRate > 50) {
        this.obstacle.spawnRateFactor -= 0.25;
        if (this.gapSize > 150) this.gapSize -= 50;
        this.increasedDifficulty = true;
        console.log(this.gapSize);
      }
    }
    if (this.score % 50 !== 0) {
      this.increasedDifficulty = false;
    }
  }

  restartGame() {
    if (this.gameOver) {
      this.score = 0;
      this.obstacle.obstacleArr = [];
      this.particle.particleArr = [];
      this.frame = 0;
      this.bird.lives = 3;
    }
  }

  handleScore() {
    ctx.fillStyle = this.gradient;
    ctx.font = "90px Goergia";
    ctx.strokeText(this.score, 450, 70);
    ctx.fillText(this.score, 450, 70);
  }

  handleBackground() {
    const movement = this.gameSpeed + this.speedMultiplier;

    // Update the position of the first background image
    this.backgroundConfig.x1 -= movement;
    if (this.backgroundConfig.x1 <= -this.backgroundConfig.width) {
      this.backgroundConfig.x1 += this.backgroundConfig.width * 2;
    }

    // Update the position of the second background image
    this.backgroundConfig.x2 -= movement;
    if (this.backgroundConfig.x2 <= -this.backgroundConfig.width) {
      this.backgroundConfig.x2 += this.backgroundConfig.width * 2;
    }

    if (this.score % 10 === 0 && this.score > 0 && !this.imageChanged) {
      this.imageNum ++;
      this.imageChanged = true;
    }

    if (this.score % 10 !== 0) {
      this.imageChanged = false;
    }

    if (this.imageNum > 2) {
      this.imageNum = 0;
    }

    ctx.drawImage(
      this.imgArr[this.imageNum],
      this.backgroundConfig.x1,
      this.backgroundConfig.y,
      this.backgroundConfig.width,
      this.backgroundConfig.height
    );
    ctx.drawImage(
      this.imgArr[this.imageNum],
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
        this.powerUpHeight / 10,
        this.powerUpWidth / 10
      );
    }
  }

  drawShield() {
    if (this.isSmallPowerUpActive) {
      this.scaleDown = 9;
      this.offSetX = 28;
      this.offSetY = 12;
    } else {
      this.scaleDown = 4.5;
      this.offSetX = 0;
      this.offSetY = 0;
    }
    if (this.isShieldActive) {
      ctx.drawImage(
        this.shield,
        this.bird.x - 35 + this.offSetX,
        this.bird.y - 35 + this.offSetY,
        472 / this.scaleDown,
        472 / this.scaleDown
      );
    }
  }

  drawJetpack() {
    if (this.islightingActive) {
      if (this.isSmallPowerUpActive) {
        this.jetpackScaleDown = 9;
        this.offSetXJetpack = 60;
        this.offSetYJetpack = 20;
      }
      ctx.drawImage(
        this.jetpack,
        this.bird.x - 80 + this.offSetXJetpack,
        this.bird.y - 45 + this.offSetYJetpack,
        472 / this.jetpackScaleDown,
        472 / this.jetpackScaleDown
      );
    }
  }
  updateScore() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUserArr =
      JSON.parse(localStorage.getItem("loggedInUser")) || [];

    if (loggedInUserArr.length > 0) {
      const loggedInUser = loggedInUserArr[0];
      if (loggedInUser && loggedInUser.score !== undefined) {
        if (this.score > loggedInUser.score) {
          loggedInUser.score = this.score;
          const loggedInUserIndex = users.findIndex(
            (user) => user.email === loggedInUser.email
          );
          if (loggedInUserIndex !== -1) {
            users[loggedInUserIndex] = loggedInUser;
            localStorage.setItem("users", JSON.stringify(users));
          }
        }
      }
    }
  }

  handlePowerUp() {
    this.spawnPowerUp();
    if (this.powerUp !== null) {
      if (this.powerUp instanceof Globe) {
        this.scaleFactor = 1.5;
      } else {
        this.scaleFactor = 1;
      }
      this.updatePowerUp();
      this.drawPowerUp();
      this.consumePowerUp();
    }
  }

  updatePowerUp() {
    this.powerUp.update();
  }

  drawPowerUp() {
    this.powerUp.draw();
  }

  consumePowerUp() {
    {
      const birdInRange =
        this.bird.x > this.powerUp.x * this.scaleFactor &&
        this.bird.x <
          this.powerUp.x + (this.powerUpWidth / 10) * this.scaleFactor &&
        this.bird.y < this.powerUp.y * this.scaleFactor &&
        this.bird.y >
          this.powerUp.y -
            this.powerUp.canvasRect.top +
            (this.powerUpHeight / 10) * this.scaleFactor;
      if (birdInRange) {
        if (!this.powerUp.consumed) {
          this.powerUp.effect();
          this.resetPowerUp();
        }
      } else if (
        this.powerUp.x + (this.powerUpWidth / 10) * this.scaleFactor <
        0
      ) {
        this.resetPowerUp();
      }
    }
  }

  resetPowerUp() {
    this.powerUp.consumed = true;
    this.powerUp = null;
  }

  spawnPowerUp() {
    if (
      this.frame % (this.obstacle.spawnRate * 4) === 0 &&
      this.powerUp === null
    ) {
      this.powerUpSpawned = true;
      const randomPowerUpIndex = Math.floor(
        Math.random() * this.powerUpTypes.length
      );
      const randomPowerUp = this.powerUpTypes[randomPowerUpIndex];
      switch (randomPowerUp) {
        case "heart": {
          this.powerUp = new HeartPowerUp(
            this,
            this.obstacle,
            this.bird,
            this.heart.src
          );
          break;
        }
        case "doublePoints": {
          this.powerUp = new DoublePoints(
            this,
            this.obstacle,
            this.bird,
            this.doublePoints.src
          );
          break;
        }
        case "lighting": {
          this.powerUp = new Lighting(
            this,
            this.obstacle,
            this.bird,
            this.light.src
          );
          break;
        }
        case "shield": {
          this.powerUp = new Shield(
            this,
            this.obstacle,
            this.bird,
            this.shield.src
          );
          break;
        }
        case "small": {
          this.powerUp = new Small(
            this,
            this.obstacle,
            this.bird,
            this.small.src
          );
          break;
        }
        case "coin": {
          this.powerUp = new Coin(
            this,
            this.obstacle,
            this.bird,
            this.coin.src
          );
          break;
        }
        case "globe": {
          this.powerUp = new Globe(
            this,
            this.obstacle,
            this.bird,
            this.globe.src
          );
          break;
        }
      }
      if (this.powerUp) {
        this.powerUp.x = canvas.width;
        this.powerUp.consumed = false;
      }
    }
  }
}

class Bird {
  constructor(game) {
    this.game = game;
    this.initX = 0;
    this.initY = 0;
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
    this.ratio = 0;
    this.lives = 3;
    this.offSetX = 0;
    this.offSetY = 0;
    this.character = new Image();
    this.character.src = "../images/flappybird images/ghostCharacter.png";
    this.egg = new Egg(this);

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

    if (this.y < 0 + this.height * 5 - curve) {
      // Make sure bird doesn't go above canvas
      this.y = 0 + this.height * 5 - curve;
    }

    if (this.y <= canvas.height - this.height - curve) {
      // If bird within boundaries
      if (this.game.isGravityActive) {
        this.velocity -= this.weight;
      } else {
        this.velocity += this.weight;
      } // Gravity simulation
      this.velocity *= 0.8; // Damping effect
      this.x += this.game.speedMultiplier;
      this.y += this.velocity;
    }

    this.draw();
  }

  draw() {
    if (this.game.isSmallPowerUpActive) {
      this.ratio = 10;
      this.offSetX = 40;
      this.offSetY = 20;
    } else {
      this.ratio = 4;
      this.offSetX = 0;
      this.offSetY = 0;
    }
    ctx.drawImage(
      this.character,
      this.initX,
      this.initY,
      this.imageWidth,
      this.imageHeight,
      this.x - 50 + this.offSetX,
      this.y - 40 + this.offSetY,
      this.imageWidth / this.ratio,
      this.imageHeight / this.ratio
    );
    this.egg.handleEgg();
  }

  flap() {
    const currentTime = Date.now();
    this.game.spaceKeyPressed = true;
    if (this.game.isGravityActive) {
      this.velocity += 30;
    } else {
      this.velocity -= 30;
    }

    this.flappAllowed = false; // State handling
    this.lastFlapTime = currentTime;

    if (this.audio) {
      this.audio.currentTime = 0;
    } else {
      this.audio = new Audio("../audio/flap.mp3");
    }
    this.audio.play();
  }
}

class Obstacles {
  constructor(game, bird) {
    this.game = game;
    this.bird = bird;
    this.offScreenCanvas = document.createElement("canvas");
    this.offScreenCtx = this.offScreenCanvas.getContext("2d");
    this.bottom = (Math.random() * canvas.height) / 3 + 20;
    this.top = canvas.height - this.game.gapSize - this.bottom + 20;
    this.gap = canvas.height - this.bottom - this.top;
    this.x = canvas.width;
    this.width = 50;
    this.offScreenCanvas.width = this.width;
    this.offScreenCanvas.top = this.top;
    this.color = "hsla(" + this.game.hue + ",100%,50%,1)";
    this.counted = false;
    this.pipeRow = this.game.pipeRow % 4;
    this.pipeCol = this.game.pipeCol;
    this.lifeDecreased = false;
    this.obstacleArr = [];
    this.bang = new Image();
    this.pipeTop = new Image();
    this.pipeBottom = new Image();
    this.pipeSprite = new Image();
    this.pipeSprite.src = "../images/flappybird images/PipeSprite.png"
    this.pipeTop.src = "../images/flappybird images/PipeTop.png";
    this.pipeBottom.src = "../images/flappybird images/PipeBottom.png";
    this.bang.src = "../images/flappybird images/bang.png";
    this.spawnRate = 0;
    this.spawnRateFactor = 1;
  }

  draw() {
      ctx.drawImage( // Draw Top Pipe
        this.pipeSprite, 
        this.pipeRow * 32,
        this.pipeCol * 80,
        32,
        80,
        this.x,
        0,
        this.width,
        this.top,
      );
      ctx.drawImage( // Draw Bottom Pipe
        this.pipeSprite,
        this.pipeRow * 32,
        this.pipeCol * 80,
        32,
        80,
        this.x,
        canvas.height - this.bottom,
        this.width,
        this.bottom
      );
    };

  update() {
    const movement = this.game.gameSpeed + this.game.speedMultiplier;
    this.x -= movement;
    if (!this.counted && this.bird && this.x < this.bird.x) {
      this.game.playSound("../audio/point.mp3");
      this.game.score++;
      this.game.score += this.game.scoreBonus;
      this.counted = true; // Flag so we dont keep counting the same obstacle
    }
    this.draw();
  }
  handleObstacles() {
    this.x -= this.game.gameSpeed;
    this.spawnRate = 200 * this.spawnRateFactor;

    if (
      this.game.frame %
        (this.spawnRate / (this.game.islightingActive ? 5 : 1)) ===
      0
    ) {
      this.obstacleArr.unshift(new Obstacles(this.game, this.bird));
      this.game.pipeRow++;
      if(this.game.pipeRow % 4 === 0) {
        this.game.pipeCol++;
      }
      if (this.game.pipeCol > 1) {
        this.game.pipeCol = 0;
      }
    }
    for (let i = 0; i < this.obstacleArr.length; i++) {
      this.obstacleArr[i].update(); // Draw the obstacle
    }
    if (this.obstacleArr.length > 20) {
      this.obstacleArr.pop(); // Pop from array so no memory overload
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
          if (!this.obstacleArr[i].lifeDecreased) {
            this.game.playSound("../audio/bang.mp3");
            this.bird.lives--;
            this.obstacleArr[i].lifeDecreased = true;
            console.log("Life decreased");
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
        this.game.playSound("../audio/die.mp3");
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

class PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    this.game = game;
    this.obstacle = obstacle;
    this.bird = bird;
    this.img = new Image();
    this.img.src = imgSrc;
    this.offSetX = 13;
    this.x = canvas.width;
    this.powerUp = null;
    this.consumed = false;
    this.canvasRect = canvas.getBoundingClientRect();
    this.y =
      (canvas.height -
        this.obstacle.obstacleArr[0].bottom -
        this.game.powerUpWidth / 10 -
        this.obstacle.obstacleArr[0].top) /
        2 +
      this.obstacle.obstacleArr[0].top;
  }

  draw() {
    if (!this.consumed) {
      ctx.drawImage(
        this.img,
        this.x,
        this.y,
        (this.game.powerUpHeight / 10) * this.game.scaleFactor,
        (this.game.powerUpWidth / 10) * this.game.scaleFactor
      );
    }
  }

  update() {
    this.x -= this.game.gameSpeed + this.game.speedMultiplier;
  }

  effect() {}
}

class HeartPowerUp extends PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    super(game, obstacle, bird, imgSrc);
  }
  effect() {
    if (this.bird.lives < 3) {
      this.bird.lives++;
    }
  }
}

class DoublePoints extends PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    super(game, obstacle, bird, imgSrc);
  }
  effect() {
    this.game.scoreBonus = 1;
    setTimeout(() => {
      this.game.scoreBonus = 0;
    }, 5000);
  }
}

class Lighting extends PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    super(game, obstacle, bird, imgSrc);
  }
  effect() {
    this.game.deactivateCollision = true;
    this.game.islightingActive = true;
    this.game.speedMultiplier = 5;

    // Store the initial position of the bird before the power-up
    const initialX = this.bird.x;

    const startTime = performance.now();
    const duration = 3000; // Duration of the power-up effect in milliseconds

    const updatePosition = (currentTime) => {
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        // Calculate the new position using linear interpolation (lerp)
        this.bird.x = initialX + (elapsedTime / duration) * (50 - initialX);

        // Continue updating the position
        requestAnimationFrame(updatePosition);
      } else {
        // Reset the position when the effect duration is over
        this.game.speedMultiplier = 0;
        this.game.islightingActive = false;
        this.game.deactivateCollision = false;
      }
    };

    // Start the position update animation
    requestAnimationFrame(updatePosition);
  }
}

class Shield extends PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    super(game, obstacle, bird, imgSrc);
  }
  effect() {
    this.game.isShieldActive = true;
    this.game.deactivateCollision = true;
    setTimeout(() => {
      this.game.isShieldActive = false;
      this.game.deactivateCollision = false;
    }, 5000);
  }
}

class Small extends PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    super(game, obstacle, bird, imgSrc);
  }
  effect() {
    this.game.isSmallPowerUpActive = true;
    setTimeout(() => {
      this.game.isSmallPowerUpActive = false;
    }, 5000);
  }
}

class Coin extends PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    super(game, obstacle, bird, imgSrc);
  }
  effect() {
    this.game.score += 5;
  }
}

class Globe extends PowerUp {
  constructor(game, obstacle, bird, imgSrc) {
    super(game, obstacle, bird, imgSrc);
  }
  effect() {
    this.game.isGravityActive = true;
    setTimeout(() => {
      this.game.isGravityActive = false;
    }, 5000);
  }
}

class Egg {
  constructor(bird) {
    this.bird = bird;
    this.x = this.bird.x;
    this.y = this.bird.y;
    this.eggWidth = 429;
    this.eggHeight = 582;
    this.img = new Image();
    this.img.src = "../images/flappybird images/egg.png";
    this.speedY = 0;
    this.gravity = 0.2;
    this.gravitySpeed = 0;
    this.bounceFactor = 0.8;
    this.isBouncing = false;
    this.rockBottom = canvas.height - this.eggHeight / 15;
    this.finishedBouncing = false;
    this.bounceCount = 0;
  }
  draw() {
    ctx.drawImage(
      this.img,
      this.bird.x,
      this.y,
      this.eggWidth / 15,
      this.eggHeight / 15
    );
  }
  update() {
    this.gravitySpeed += this.gravity;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
    this.checkFinishedBouncing();
  }

  hitBottom() {
    if (this.y > this.rockBottom) {
      this.y = this.rockBottom;
      this.gravitySpeed = -(this.gravitySpeed * this.bounceFactor);
      this.finishedBouncing = false;
      this.bounceCount++;
    }
  }

  checkFinishedBouncing() {
    if (this.bounceCount == 7) {
      this.onFinishedBouncing();
      this.finishedBouncing = true;
    }
  }

  onFinishedBouncing() {}

  handleEgg() {
    this.update();
    this.draw();
  }
}

const game = new Game();
