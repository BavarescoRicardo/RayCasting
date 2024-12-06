import { canvasHeight, canvasWidth, sizeTile } from './rayscasting.js';

export class Ray {
    constructor(con, cenario, x, y, playerAngle, increseAngle, column) {
        this.context = con;
        this.cenario = cenario;
        this.x = x;
        this.y = y;
        this.playerAngle = playerAngle;
        this.increseAngle = increseAngle;
        this.column = column;

        this.wallHitX = 0;
        this.wallHitY = 0;

        this.wallHitXHorizontal = 0;
        this.wallHitYHorizontal = 0;

        this.wallHitXVertical = 0;
        this.wallHitYVertical = 0;
    }

    setAngle(turnAngle) {
        this.turnAngle = this.normalizeAngle(turnAngle + this.increseAngle);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    normalizeAngle(angle) {
        return (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    }

    cast() {
        this.interceptX = 0;
        this.interceptY = 0;
    
        this.xStep = 0;
        this.yStep = 0;
    
        this.down = false;
        this.left = false;
    
        // Determine direções
        this.down = this.turnAngle > 0 && this.turnAngle < Math.PI;
        this.left = this.turnAngle > Math.PI / 2 && this.turnAngle < (3 * Math.PI) / 2;
    
        // Interseções horizontais
        let matchH = false;
        this.interceptY = Math.floor(this.y / sizeTile) * sizeTile;
        if (this.down) {
            this.interceptY += sizeTile;
        }
    
        const tangent = Math.tan(this.turnAngle);
        this.interceptX = this.x + (this.interceptY - this.y) / tangent;
    
        this.xStep = sizeTile / tangent;
        if (!this.down) {
            this.xStep = -this.xStep;
        }
    
        let nextXH = this.interceptX;
        let nextYH = this.down ? this.interceptY : this.interceptY - 1;
    
        while (!matchH) {
            const tileX = Math.floor(nextXH / sizeTile);
            const tileY = Math.floor((nextYH + (this.down ? 0 : -1)) / sizeTile);
    
            if (tileX < 0 || tileX >= this.cenario.widthM || tileY < 0 || tileY >= this.cenario.heightM) {
                break; // Fora do mapa
            }
    
            if (this.cenario.collision(tileX, tileY)) {
                matchH = true;
                this.wallHitXHorizontal = nextXH;
                this.wallHitYHorizontal = nextYH;
            } else {
                nextXH += this.xStep;
                nextYH += this.down ? sizeTile : -sizeTile;
            }
        }
    
        // Interseções verticais
        let matchV = false;
        this.interceptX = Math.floor(this.x / sizeTile) * sizeTile;
        if (!this.left) {
            this.interceptX += sizeTile;
        }
    
        const slope = Math.tan(this.turnAngle);
        this.interceptY = this.y + (this.interceptX - this.x) * slope;
    
        this.xStep = this.left ? -sizeTile : sizeTile;
        this.yStep = this.xStep * slope;
    
        let nextXV = this.interceptX;
        let nextYV = this.interceptY;
    
        while (!matchV) {
            const tileX = Math.floor(nextXV / sizeTile);
            const tileY = Math.floor(nextYV / sizeTile);
    
            if (tileX < 0 || tileX >= this.cenario.widthM || tileY < 0 || tileY >= this.cenario.heightM) {
                break; // Fora do mapa
            }
    
            if (this.cenario.collision(tileX, tileY)) {
                matchV = true;
                this.wallHitXVertical = nextXV;
                this.wallHitYVertical = nextYV;
            } else {
                nextXV += this.xStep;
                nextYV += this.yStep;
            }
        }
    
        // Escolher a interseção mais próxima
        const distHorizontal = Math.hypot(this.wallHitXHorizontal - this.x, this.wallHitYHorizontal - this.y);
        const distVertical = Math.hypot(this.wallHitXVertical - this.x, this.wallHitYVertical - this.y);
    
        if (distHorizontal < distVertical) {
            this.wallHitX = this.wallHitXHorizontal;
            this.wallHitY = this.wallHitYHorizontal;
        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
        }
    
    }
    

    draw() {
        this.cast();
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.wallHitX, this.wallHitY);
        this.context.strokeStyle = 'red';
        this.context.stroke();
    }
}
