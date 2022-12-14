import {Player} from "./entities/Player.js";
import {InputHandler} from "./entities/InputHandler.js";
import {UserInterface} from "./entities/UserInterface.js";
import {Angler1} from "./entities/Angler1.js";
import {Background} from "./entities/Background.js";
import {Angler2} from "./entities/Angler2.js";
import {LuckyFish} from "./entities/LuckyFish.js";
import {Particle} from "./entities/Particle.js";

window.addEventListener("load", function () {
    /**
     * Canvas Setup
     */
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 500;


    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UserInterface(this);
            this.keys = [];
            this.enemies = [];
            this.particles = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 10;
            this.gameTime = 0;
            this.timeLimit = 15000;
            this.speed = 1;
            this.debug = true;
        }

        update(deltaTime) {
            if (!this.gameOver) this.gameTime += deltaTime
            if (this.gameTime > this.timeLimit) this.gameOver = true;

            this.background.update();
            this.background.layer4.update();
            this.player.update(deltaTime);

            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }

            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.enemies.forEach(enemy => {
                enemy.update()
                if (this.checkCollisions(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                    for (let i = 0; i < 10; i++) {
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    }
                    if (enemy.type === "lucky") this.player.enterPowerUp();
                    else this.score--;
                }

                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollisions(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));

                        if (enemy.lives <= 0) {
                            for (let i = 0; i < 10; i++) {
                                this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }
                            enemy.markedForDeletion = true;
                            if (!this.gameOver) this.score += enemy.score;
                            if (this.score > this.winningScore) this.gameOver = true;
                        }
                    }
                })
            })
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            if (this.enemyTimer > this.enemyInterval && this.gameOver === false) {
                this.addEnemy()
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime;
            }
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.particles.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
            this.background.layer4.draw(context);
        }

        addEnemy() {
            const randomize = Math.random();

            if (randomize < 0.3) this.enemies.push(new Angler1(this));
            if (randomize < 0.6) this.enemies.push(new Angler2(this));
            else this.enemies.push(new LuckyFish(this));
        }

        checkCollisions(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y
            )
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    /**
     * Animation loop
     */
    (function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);

        requestAnimationFrame(animate);
    })(0);
});