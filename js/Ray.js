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

    setPosotion(x,y){        
        this.x = x;
        this.y = y;
        
    }

    normalizeAngle(angle) {
        return (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    }
    


//#### TODO
    // ### Calculos de trigonometria, transformar em classe apos ..
    cast() {
        this.interceptX = 0;
        this.interceptY = 0;
    
        this.xStep = 0;
        this.yStep = 0;
    
        this.down = false;
        this.left = false;
    
        if (this.playerAngle < Math.PI) this.down = true;
        if (this.playerAngle > Math.PI / 2 && this.playerAngle < (3 * Math.PI) / 2) this.left = true;
    
        var matchH = false;
        this.interceptY = Math.floor(this.y / sizeTile) * sizeTile;
    
        if (this.down) {
            this.interceptY += sizeTile;
        }
    
        // Check for zero tangent
        var tangent = Math.tan(this.turnAngle);
        if (Math.abs(tangent) < 1e-6) {
            tangent = 1e-6; // Assign a small value to avoid division by zero
        }
    
        var catetoAdjacente = (this.interceptY - this.y) / tangent;
        this.interceptX = this.x + catetoAdjacente;
    
        // Calculate step sizes for horizontal intersections
        this.xStep = sizeTile / tangent;
        if (!this.down) {
            this.xStep = -this.xStep;
        }
    
        var nextXH = this.interceptX;
        var nextYH = this.interceptY;
    
        if (!this.down) {
            nextYH--;
        }
    
        while (!matchH) {
            var tileX = Math.floor(nextXH / sizeTile);
            var tileY = Math.floor(nextYH / sizeTile);
        
            // Verificar se está fora dos limites
            if (tileX < 0 || tileX >= this.cenario.widthT || tileY < 0 || tileY >= this.cenario.heightT) {
                break; // Fora dos limites, parar loop
            }
        
            // Verificar colisão
            if (this.cenario.collision(tileX, tileY)) {
                matchH = true;
                this.wallHitXHorizontal = nextXH;
                this.wallHitYHorizontal = nextYH;
            } else {
                nextXH += this.xStep;
                nextYH += (this.down ? sizeTile : -sizeTile);
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
        
        while (!matchV && (nextXV >= 0 && nextYV >= 0 && nextXV < canvasWidth && nextYV < canvasHeight)) {            
            var tileX = parseInt(nextXV / sizeTile);
            var tileY = parseInt(nextYV / sizeTile);

            if (this.cenario.collision(tileY, tileX)) {
                matchV = true;
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

        // Show ray as a line This should. Show ray as a line
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
