import { canvasHeight, canvasWidth, sizeTile, halfFov, FOV } from './rayscasting.js';

export class Ray {
    constructor(con, cenario, x, y, playerAngle, increseAngle, column) {
        this.context = con;
        this.cenario = cenario;
        this.x = x;
        this.y = y;
        this.playerAngle = playerAngle;
        this.increseAngle = increseAngle;
        this.column = column;
        this.distance = 0;

        this.wallHitX = 0;
        this.wallHitY = 0;

        this.wallHitXHorizontal = 0;
        this.wallHitYHorizontal = 0;

        this.wallHitXVertical = 0;
        this.wallHitYVertical = 0;
    }

    setAngle(turnAngle) {
        this.playerAngle = turnAngle;
        this.turnAngle = this.normalizeAngle(turnAngle) + this.increseAngle;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;      
    }

    normalizeAngle(angle) {
        this.angle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        return this.angle;
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
        // encontra qual indice y o jogador deve estar
        this.interceptY = Math.floor(this.y / sizeTile) * sizeTile;
        if (this.down) {
            // se tiver olhando para baixo o indice y recebe o tamanho do quadrado do mapa
            this.interceptY += sizeTile;
        }
    
        const tangent = Math.tan(this.turnAngle);
        // calcula a intersecsao dividindo a intersecao y pela tangente? esta certo essa conta?
        this.interceptX = this.x + (this.interceptY - this.y) / tangent;
    
        this.xStep = sizeTile / tangent;
        if (!this.down) {
            this.xStep = -this.xStep;
        }
    
        let nextXH = this.interceptX;
        let nextYH = this.down ? this.interceptY : this.interceptY - 1;
    
        while (!matchH) {
            const tileX = Math.floor(nextXH / sizeTile);
            const tileY = this.down ? Math.floor(nextYH / sizeTile) : Math.floor((nextYH - 1) / sizeTile);
    
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
            const tileX = this.left ? Math.floor((nextXV - 1) / sizeTile) : Math.floor(nextXV / sizeTile);
            const tileY = Math.floor(nextYV / sizeTile);
    
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
            this.distance = distHorizontal;
        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
            this.distance = distVertical;
        }
    
        // Corrigir a distorção causada pelo ângulo
        this.distance = this.distance * Math.cos(this.playerAngle - this.turnAngle);
    }
    
    
    // Funcao para renderizar 3d todo - deixar a parte de 3d em outra classe para a segunda div canvas3d
    wallRender() {
        this.cast();

        var heightTile = 500;
        var perpectiveDistance = (canvasWidth / 2)/Math.tan(halfFov);
        var wallHeigth = heightTile / this.distance * perpectiveDistance;

        // Calculos parede para visao do jogador
        var y0 = parseInt((canvasHeight / 2) - parseInt(wallHeigth / 2));
        var y1 = y0 + wallHeigth;
        var x = this.column;

        // draw simulated 3d world 
        this.context.beginPath();
        this.context.moveTo(x, y0);
        this.context.lineTo(x, y1);
        this.context.strokeStyle = '#666';
        this.context.stroke();

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
