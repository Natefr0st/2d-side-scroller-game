import {Enemy} from "./Enemy.js";

export class Angler1 extends Enemy {
    constructor(game) {
        super(game);
        this.width = 228;
        this.height = 169;
        this.y = Math.random() * (this.game.height * 0.9 - this.height);
        this.image = document.getElementById("angler1");
        this.frameY = Math.floor(Math.random() * 3);
    }
}