import {Player} from "./entities/Player.js";
import {InputHandler} from "./entities/InputHandler.js";

window.addEventListener("load", function () {
    /**
     * Canvas Setup
     */
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1500;
    canvas.height = 500;


    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.keys = [];
            this.ammo = 20;
        }

        update() {
            this.player.update();
        }

        draw(context) {
            this.player.draw(context)
        }
    }

    const game = new Game(canvas.width, canvas.height);

    /**
     * Animation loop
     */
    (function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    })();
});