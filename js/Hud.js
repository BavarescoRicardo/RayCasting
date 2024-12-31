import { Level } from './Level.js';
import { Player } from './Player.js';

export class Hud {
    constructor(player2d, player3d) {
        console.log("Hud do Jogo");
        this.player2d = player2d;
        this.player3d = player3d;

        this.canvasHud = document.getElementById('hud');
        this.contextHud = this.canvasHud.getContext('2d');

        // Set canvas dimensions
        this.canvasHud.width = 300;
        this.canvasHud.height = 300;

        // Load button images
        this.imgUp = new Image();
        this.imgDown = new Image();
        this.imgLeft = new Image();
        this.imgRight = new Image();
        this.imgUp.src = "/js/assets/arrow-up.png";
        this.imgDown.src = "/js/assets/arrow-down.png";
        this.imgLeft.src = "/js/assets/arrow-left.png";
        this.imgRight.src = "/js/assets/arrow-right.png";

        // Wait for all images to load before drawing the HUD
        const images = [this.imgUp, this.imgDown, this.imgLeft, this.imgRight];
        Promise.all(images.map(img => new Promise(resolve => img.onload = resolve)))
            .then(() => this.drawHud());

        // Add mouse event listeners
        this.canvasHud.addEventListener('click', this.handleHudClick.bind(this));
    }

    drawHud() {
        const ctx = this.contextHud;

        // Clear HUD canvas
        ctx.clearRect(0, 0, this.canvasHud.width, this.canvasHud.height);

        // Draw directional buttons
        const buttonSize = 50;
        const centerX = this.canvasHud.width / 2;
        const centerY = this.canvasHud.height / 2;

        // Up
        ctx.drawImage(this.imgUp, centerX - buttonSize / 2, centerY - 1.5 * buttonSize, buttonSize, buttonSize);

        // Down
        ctx.drawImage(this.imgDown, centerX - buttonSize / 2, centerY + 0.5 * buttonSize, buttonSize, buttonSize);

        // Left
        ctx.drawImage(this.imgRight, centerX - 1.5 * buttonSize, centerY - buttonSize / 2, buttonSize, buttonSize);

        // Right
        ctx.drawImage(this.imgLeft, centerX + 0.5 * buttonSize, centerY - buttonSize / 2, buttonSize, buttonSize);
    }

    handleHudClick(event) {
        const rect = this.canvasHud.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const buttonSize = 50;
        const centerX = this.canvasHud.width / 2;
        const centerY = this.canvasHud.height / 2;

        // Check if click is within any button's area
        if (this.isWithinButton(x, y, centerX, centerY - 1.5 * buttonSize)) {
            this.player2d.moveUp();
            this.player3d.moveUp();
        } else if (this.isWithinButton(x, y, centerX, centerY + 0.5 * buttonSize)) {
            this.player2d.moveDown();
            this.player3d.moveDown();
        } else if (this.isWithinButton(x, y, centerX - 1.5 * buttonSize, centerY)) {
            this.player2d.moveLeft();
            this.player3d.moveLeft();
        } else if (this.isWithinButton(x, y, centerX + 0.5 * buttonSize, centerY)) {
            this.player2d.moveRigth();
            this.player3d.moveRigth();
        }
    }

    isWithinButton(x, y, buttonX, buttonY, buttonSize = 50) {
        return x >= buttonX && x <= buttonX + buttonSize && y >= buttonY && y <= buttonY + buttonSize;
    }
}
