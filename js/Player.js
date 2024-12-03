import { playerColor } from './rayscasting.js';
import { Ray } from './Ray.js';
export class Player {
    constructor(con, cenario, x, y){
        this.context = con;
        this.cenario = cenario;

        this.x = x;
        this.y = y;

        this.move = 0;
        this.turn = 0;        
        
        this.turnAngle = 0;
        this.moveSpeed = 3; // 3 px por ciclo 
        this.turnSpeed = Math.PI / 60; // volta completa é 180 e divide por 3 porque é a velocidade do movimento 180/3 = 60 em graus

        this.ray = new Ray(this.context, this.cenario, this.x, this.y, this.turnAngle, 0, 0);        
    }

    
    moveUp() {
        this.move = 1;

    }
    
    moveDown() {
        this.move = -1;
    }
    
    moveRigth() {
        this.turn = 1;
    }
    
    moveLeft() {
        this.turn = -1;
    }
    
    releaseMove() {
        this.move = 0;
    }
    
    releaseTurn() {
        this.turn = 0;
    }
    
    updateMovement() {
        var newX = this.x + (this.move * Math.cos(this.turnAngle) * this.moveSpeed);
        var newY = this.y + (this.move * Math.sin(this.turnAngle) * this.moveSpeed);
        if(!this.cenario.collision(parseInt(this.x/this.cenario.widthT), parseInt(this.y/this.cenario.heightT))){
            this.x = newX;
            this.y = newY;
        }
        
        this.turnAngle += this.turn * this.turnSpeed;
        if (this.turnAngle > 2*Math.PI){
            this.turnAngle = 0;
        }
        if (this.turnAngle < 0){
            this.turnAngle += this.turnAngle + (2*Math.PI);
        }
        
        this.ray.setAngle(this.turnAngle);
        this.ray.setPosotion(this.x, this.y);
        this.ray.draw();
    }
    
    draw() {
        this.updateMovement();
        this.context.fillStyle = playerColor;
        this.context.fillRect(this.x - 4, this.y - 4, 8,8); // passo a posicao e o tamanho é o dobro da velocidade

        // Draw line wich player is pointing to
        var fovX = this.x + (Math.cos(this.turnAngle) * 100);
        var fovY = this.y + (Math.sin(this.turnAngle) * 100);
        
        // it should dow a line from to player and forward where is looking at
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(fovX, fovY);
        this.context.strokeStyle = '#AAA';
        this.context.stroke();        
    }
}
