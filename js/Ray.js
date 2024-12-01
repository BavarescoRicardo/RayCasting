import { playerColor, sizeTile } from './rayscasting.js';

export class Ray {
    constructor(con, cenario, x, y, playerAngle, increseAngle, column){
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

    setAngle(turnAngle){
        this.turnAngle = normalizeAngle(turnAngle + this.increseAngle);
        
    }


//#### TODO
    // ### Calculos de trigonometria, transformar em classe apos ..
    cast() {
        this.interceptX = 0;
        this.interceptY = 0;

        this.xStep = 0;
        this.yStep = 0;

        this.down =  false;
        this.left =  false;

        if (this.playerAngle < Math.PI)
            this.down =  true;

        if (this.playerAngle > Math.PI/2 && this.playerAngle < 3 * Math.PI/2)
            this.left =  true;      

        var matchH = false;
        this.interceptY = Math.floor(this.y/sizeTile) * sizeTile;

        if(this.down){
            this.interceptY += sizeTile;
        }

        var catetoAdjacente = (this.interceptY - this.y) / Math.tan(this.turnAngle);
        this.interceptX = this.x + catetoAdjacente;

        // calculo da distancia entre cada interseccao do cenario -- step
        this.yStep = sizeTile;
        this.xStep = this.yStep / Math.tan(this.turnAngle);

        // case move upward
        if(!this.down){
            this.yStep = -this.yStep;
        }

        var nextXH = this.interceptX;
        var nextYH = this.interceptY;

        if(!this.down){
            nextYH--;
        }

        while (!matchH) {

            var tileX = parseInt(nextXH/sizeTile);
            var tileY = parseInt(nextYH/sizeTile);

            if (this.cenario.collision(tileX, tileY)) {
                matchH = true;
                this.wallHitXHorizontal = nextXH;
                this.wallHitYHorizontal = nextYH;                
            } else {
                nextXH += this.xStep;
                nextYH += this.yStep;
            }            
        }
        
        this.wallHitX = this.wallHitXHorizontal;
        this.wallHitY = this.wallHitYHorizontal;
    
    }

    draw() {
        this.cast();

        // Show ray as a line
        var xDestine = this.wallHitX;
        var yDestine = this.wallHitY;

        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(xDestine, yDestine);
        this.context.strokeStyle = 'red';
        this.context.stroke();
    }

    ///  Fim Calculos de trigonometria ###
    
}
