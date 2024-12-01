import { canvasHeight, canvasWidth, sizeTile } from './rayscasting.js';

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
        this.turnAngle = this.normalizeAngle(turnAngle + this.increseAngle);
        
    }

    normalizeAngle(angle) {
        this.turnAngle = angle % (2 * Math.PI);
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

        // calculo da distancia entre cada interseccao do cenario -- step x
        this.yStep = sizeTile;
        this.yStep = this.yStep / Math.tan(this.turnAngle);

        // case move upward
        if(!this.down){
            this.yStep = -this.yStep;
        }

        if(!this.down){
            nextYH--;
        }

        while (!matchH) {

            var tileX = parseInt(nextXH/sizeTile);
            var tileY = parseInt(nextYH/sizeTile);

            // if (this.cenario.collision(tileX, tileY)) {
            if (this.cenario.collision(1, 2)) {
                matchH = true;
                this.wallHitXHorizontal = nextXH;
                this.wallHitYHorizontal = nextYH;                
            } else {
                nextXH += this.xStep;
                nextYH += this.yStep;
            }            
        }        

        var nextXH = this.interceptX;
        var nextYH = this.interceptY;

        this.yStep = sizeTile * Math.tan(this.turnAngle);

        if((!this.down && this.yStep > 0) || (this.down && this.yStep < 0)){
            this.yStep = -this.yStep;
        }

        var nextXV = this.interceptX;
        var nextYV = this.interceptY;     

        if(this.left){
            nextXV--;
        }

        var matchV = false;
        this.interceptX = Math.floor(this.x/sizeTile) * sizeTile;        

        if (!this.left){
            this.interceptX += sizeTile;
        }

        var catetoOposto = (this.interceptX - this.x) * Math.tan(this.turnAngle);
        this.interceptY = this.y + catetoOposto;

        // calculo da distancia entre cada interseccao do cenario -- step y
        this.xStep = sizeTile;
        this.xStep = this.yStep / Math.tan(this.turnAngle);        
        
        // case move lefy
        if(this.left){
            this.xStep = -this.xStep;
        }

        while (!matchV && (nextXV >= 0 && nextYV >= 0 && nextXV < this.canvasWidth && nextYV < this.canvasHeight)) {
            // while
            var tileX = parseInt(nextXV / sizeTile);
            var tileY = parseInt(nextYV / sizeTile);

            // if (this.cenario.collision(tileY, tileX)) {
            if (this.cenario.collision(1, 1)) {
                matchH = true;
                this.wallHitXVertical = nextXV;
                this.wallHitYVertical = nextYV;                
            } else {
                nextXV += this.xStep;
                nextYV += this.yStep;
            }  
        }

        this.wallHitX = this.wallHitXHorizontal;
        this.wallHitY = this.wallHitYHorizontal;       
    
    }

    draw() {
        this.cast();

        // Show ray as a line
        console.log("This should. Show ray as a line")
        var xDestine = this.wallHitX;
        var yDestine = this.wallHitY;

        console.log(xDestine)
        console.log(yDestine)                

        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(xDestine, yDestine);
        this.context.strokeStyle = 'red';
        this.context.stroke();
    }

    ///  Fim Calculos de trigonometria ###
    
}
