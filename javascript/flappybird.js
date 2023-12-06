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
    this.background.src = "../images/flappybird images/BG.png";
    this.heart = new Image();
    this.heart.src = "../images/flappybird images/heart.png";
    this.shield = new Image();
    this.shield.src = "../images/flappybird images/Shield.png";
    this.powerUpTypes = ["small"];
    this.heartHeight = 500;
    this.heartWidth = 500;
    this.speedMultiplier = 0;
    this.lightingActive = false;
    this.shieldActive = false;
    this.isSmallPowerUpActive = false;
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
    this.scoreBonus = 0;
    this.obstacle = new Obstacles(this, this.bird);
    this.particle = new Particle(this, this.bird);
    this.coin = new Coin(this,this.obstacle);
    this.powerUp = null;
    this.imgSrc;
    this.gameLoop();
  }

  // Main game function
  gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.handleBackground();
    this.obstacle.handleObstacles();
    this.drawLives();
    this.handlePowerUp();
    this.bird.update();
    this.drawShield();
    this.coin.hanldeCoin();
    this.handleScore();
    if (!this.shieldActive) {
      if (this.obstacle.handleCollision()) {
        if (this.bird.lives === 0) {
          this.updateScore();
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

  drawShield() {
    if (this.shieldActive) {
      ctx.drawImage(
        this.shield,
        this.bird.x - 25,
        this.bird.y - 30,
        472 / 5,
        472 / 5
      );
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
        this.bird.x > this.powerUp.x &&
        this.bird.x < this.powerUp.x + this.heartWidth / 10 &&
        this.bird.y < this.powerUp.y &&
        this.bird.y >
          this.powerUp.y - this.powerUp.canvasRect.top + this.heartHeight / 10;
      if (birdInRange) {
        if (!this.powerUp.consumed) {
          this.powerUp.effect();
          this.resetPowerUp();
        }
      } else if (this.powerUp.x + this.heartWidth / 10 < 0) {
        this.resetPowerUp();
      }
    }
  }

  resetPowerUp() {
    this.powerUp.consumed = true;
    this.powerUp = null;
  }

  spawnPowerUp() {
    if (this.score % 2 === 0 && this.score > 0 && this.powerUp === null) {
      const randomPowerUpIndex = Math.floor(
        Math.random() * this.powerUpTypes.length
      );
      const randomPowerUp = this.powerUpTypes[randomPowerUpIndex];

      switch (randomPowerUp) {
        case "heart": {
          this.imgSrc = "../images/flappybird images/heart.png";
          this.powerUp = new HeartPowerUp(
            this,
            this.obstacle,
            this.bird,
            this.imgSrc
          );
          break;
        }
        case "doublePoints": {
          this.imgSrc = "../images/flappybird images/Score Multiplier.png";
          this.powerUp = new DoublePoints(
            this,
            this.obstacle,
            this.bird,
            this.imgSrc
          );
          break;
        }
        case "lighting": {
          this.imgSrc = "../images/flappybird images/Lighting.png";
          this.powerUp = new Lighting(
            this,
            this.obstacle,
            this.bird,
            this.imgSrc
          );
          break;
        }
        case "shield": {
          this.imgSrc = "../images/flappybird images/Shield.png";
          this.powerUp = new Shield(
            this,
            this.obstacle,
            this.bird,
            this.imgSrc
          );
          break;
        }
        case "small": {
          this.imgSrc = "../images/flappybird images/Small.png";
          this.powerUp = new Small(
            this,
            this.obstacle,
            this.bird,
            this.imgSrc
          );
        }
      }
      this.powerUp.x = canvas.width;
      this.powerUp.consumed = false;
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

    if (this.y < 0 + this.height) {
      // Make sure bird doesn't go above canvas
      this.y = 0 + this.height;
    }

    if (this.y <= canvas.height - this.height - curve) {
      // If bird within boundaries
      this.velocity += this.weight; // Gravity simulation
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
    this.velocity -= 30;
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
    this.spawnRate = 0;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, 0, this.width, this.top);
    ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
  }
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
    if (!this.game.lightingActive) {
      this.spawnRate = 150;
    } else {
      this.spawnRate = 50;
    }
    if (this.game.frame % this.spawnRate === 0) {
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
            this.game.playSound("../audio/bang.mp3");
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
    this.y = (this.obstacle.top + canvas.height - this.obstacle.bottom) / 2;
    this.canvasRect = canvas.getBoundingClientRect();
  }

  draw() {
    if (!this.consumed) {
      ctx.drawImage(
        this.img,
        this.x,
        this.y - 20,
        this.game.heartHeight / 10,
        this.game.heartWidth / 10
      );
    }
  }

  update() {
    this.x -= this.game.gameSpeed + this.game.speedMultiplier;
  }

  resetPowerUp() {
    console.log("reset triggered");
    this.powerUp = null;
    this.consumed = true;
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
    this.game.lightingActive = true;
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
        this.game.lightingActive = false;
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
    this.game.shieldActive = true;
    setTimeout(() => {
      this.game.shieldActive = false;
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

class Coin {
  constructor(game,obstacle) {
    this.game = game;
    this.obstacle = obstacle;
    this.img = new Image();
    this.img.src = "../images/flappybird images/Coin.png";
    this.x = canvas.width;
    this.imageHeight = 360;
    this.imageWidth = 315;
    this.y = 50;
  }

  draw() {
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.imageWidth / 10,
      this.imageHeight / 10
    );
  }

  update() {
    this.x-=this.game.gameSpeed + this.game.speedMultiplier;
  }

  hanldeCoin() {
    this.draw();
    this.update();
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
