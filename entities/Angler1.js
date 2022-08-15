import {Enemy} from "./Enemy.js";

export class Angler1 extends Enemy {
    constructor(game) {
        super(game);
        this.width = 228 * 0.2;
        this.height = 169 * 0.2;
        this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
}