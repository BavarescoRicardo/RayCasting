export class Hud {
    constructor(player2d, player3d) {
        console.log("Hud do Jogo");
        this.player2d = player2d;
        this.player3d = player3d;        
        this.canvasHud = document.getElementById('hud');
        this.contextHud = this.canvasHud.getContext('2d');

        // Set canvas dimensions based on screen size
        this.canvasHud.width = window.innerWidth * 0.92; // 92% of the viewport width
        this.canvasHud.height = window.innerHeight * 0.18; // 18% of the viewport height


        // Load button images
        this.imgUp = new Image();
        this.imgDown = new Image();
        this.imgLeft = new Image();
        this.imgRight = new Image();
        this.imgUp.src = "/js/assets/arrow-up.png";
        this.imgDown.src = "/js/assets/arrow-down.png";
        this.imgLeft.src = "/js/assets/arrow-left.png";
        this.imgRight.src = "/js/assets/arrow-right.png";

        // Button areas for click detection
        this.buttonAreas = {};

        // Wait for all images to load before drawing the HUD
        const images = [this.imgUp, this.imgDown, this.imgLeft, this.imgRight];
        Promise.all(images.map(img => new Promise(resolve => img.onload = resolve)))
            .then(() => this.drawHud());

        // Add mouse event listener
        this.canvasHud.addEventListener('mousedown', this.handleHudClick.bind(this));
        this.canvasHud.addEventListener('mouseup', this.handleHudRelease.bind(this));                
    }

    drawHud() {
        const ctx = this.contextHud;

        // Clear HUD canvas
        ctx.clearRect(0, 0, this.canvasHud.width, this.canvasHud.height);

        // Button size and positions
        const buttonSize = 50;
        const centerX = this.canvasHud.width / 2;
        const centerY = this.canvasHud.height / 2;

        // Up
        const upX = centerX - buttonSize / 2;
        const upY = centerY - 1.5 * buttonSize;
        ctx.drawImage(this.imgUp, upX, upY, buttonSize, buttonSize);
        this.buttonAreas.up = { x: upX, y: upY, width: buttonSize, height: buttonSize };

        // Down
        const downX = centerX - buttonSize / 2;
        const downY = centerY + 0.5 * buttonSize;
        ctx.drawImage(this.imgDown, downX, downY, buttonSize, buttonSize);
        this.buttonAreas.down = { x: downX, y: downY, width: buttonSize, height: buttonSize };

        // Left
        const leftX = centerX - 1.5 * buttonSize;
        const leftY = centerY - buttonSize / 2;
        ctx.drawImage(this.imgLeft, leftX, leftY, buttonSize, buttonSize);
        this.buttonAreas.left = { x: leftX, y: leftY, width: buttonSize, height: buttonSize };

        // Right
        const rightX = centerX + 0.5 * buttonSize;
        const rightY = centerY - buttonSize / 2;
        ctx.drawImage(this.imgRight, rightX, rightY, buttonSize, buttonSize);
        this.buttonAreas.right = { x: rightX, y: rightY, width: buttonSize, height: buttonSize };
    }

    handleHudClick(event) {
        const rect = this.canvasHud.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check which button was clicked
        if (this.isWithinArea(x, y, this.buttonAreas.up)) {
            this.player2d.moveUp();
            this.player3d.moveUp();
        } else if (this.isWithinArea(x, y, this.buttonAreas.down)) {
            this.player2d.moveDown();
            this.player3d.moveDown();
        } else if (this.isWithinArea(x, y, this.buttonAreas.left)) {
            this.player2d.moveLeft();
            this.player3d.moveLeft();
        } else if (this.isWithinArea(x, y, this.buttonAreas.right)) {
            this.player2d.moveRigth();
            this.player3d.moveRigth();
        }
    }

    handleHudRelease(event) {
        const rect = this.canvasHud.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check which button was clicked
        if (this.isWithinArea(x, y, this.buttonAreas.up)) {
            this.player2d.releaseMove();
            this.player3d.releaseMove();
        } else if (this.isWithinArea(x, y, this.buttonAreas.down)) {
            this.player2d.releaseMove();
            this.player3d.releaseMove();
        } else if (this.isWithinArea(x, y, this.buttonAreas.left)) {
            this.player2d.releaseTurn();
            this.player3d.releaseTurn();
        } else if (this.isWithinArea(x, y, this.buttonAreas.right)) {
            this.player2d.releaseTurn();
            this.player3d.releaseTurn();
        }
    }    

    isWithinArea(x, y, area) {
        return (
            x >= area.x &&
            x <= area.x + area.width &&
            y >= area.y &&
            y <= area.y + area.height
        );
    }
}
