import { playerColor, canvasHeight, canvasWidth, FOV, halfFov } from './rayscasting.js';
import { Ray } from './Ray2d.js';
import { Sprite } from './Sprite.js';
export class Player {
    constructor(con, cenario, x, y, zBuffer){
        this.context = con;
        this.cenario = cenario;

        this.x = x;
        this.y = y;

        this.move = 0;
        this.turn = 0;        
        
        this.turnAngle = 0;
        this.moveSpeed = 3; // 3 px por ciclo 
        this.turnSpeed = Math.PI / 60; // volta completa é 180 e divide por 3 porque é a velocidade do movimento 180/3 = 60 em graus
        this.zBuffer = zBuffer;
        
        // Adicionar raios para todo campo de visao do personagem
        this.numRays = canvasWidth;
        this.rays = []; 
        // calcular angulo para cada raio
        this.increaseAngulo = this.convertDegres(FOV / this.numRays);
        this.initialAngle = this.convertDegres(this.turnAngle - halfFov);
        this.rayAngle = this.initialAngle;
        this.sprites = [];
        for (let index = 0; index < this.numRays; index++) {
        // for (let index = 0; index < 10; index++) {
            this.rays[index] = new Ray(this.context, this.cenario, this.x, this.y, this.turnAngle, this.rayAngle, index, this.zBuffer);   
            this.rayAngle += this.increaseAngulo;
        }

    }

    convertDegres(angulo){
        return angulo * (Math.PI / 180);
    }

    distanceBetween(x1,y1,x2,y2){
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2-y1)*(y2-y1));
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
    
    updateMovement(miniMapa) {
        // Calcula a nova posição do jogador
        var newX = this.x + (this.move * Math.cos(this.turnAngle) * this.moveSpeed);
        var newY = this.y + (this.move * Math.sin(this.turnAngle) * this.moveSpeed);
    
        // Converte as novas coordenadas para índices de matriz
        const gridX = Math.floor(newX / this.cenario.widthT);
        const gridY = Math.floor(newY / this.cenario.heightT);
    
        // Validação dos índices no mapa
        if (
            gridX < 0 || 
            gridY < 0 || 
            gridY >= this.cenario.matriz.length || 
            gridX >= this.cenario.matriz[0].length
        ) {
            console.log(`Collision Check fails: (${newX}, ${newY})`);
            return; // Evita movimento fora do mapa
        }
    
        // Verifica colisão com o mapa
        if (!this.cenario.collision(gridX, gridY)) {
            // Atualiza a posição do jogador apenas se não houver colisão
            this.x = newX;
            this.y = newY;
        }
    
        // Atualiza o ângulo de rotação
        this.turnAngle += this.turn * this.turnSpeed;
        if (this.turnAngle > 2 * Math.PI) {
            this.turnAngle = 0;
        }
        if (this.turnAngle < 0) {
            this.turnAngle += 2 * Math.PI;
        }
    
        // desenhar chao e teto
        if(!miniMapa){
            // chao
            this.context.fillStyle = "#cfccb0";
            this.context.fillRect(0, 300, 600, 500);

            // teto
            this.context.fillStyle = "#222321";
            this.context.fillRect(0, 0, 600, 300);            

            // Create Sprite objects somente para o 3d
            // Load sprites images
            var imgMechaEnemy = new Image();
            imgMechaEnemy.src = "/js/assets/mechass.png";
            var imgOfficerEnemy = new Image();
            imgOfficerEnemy.src = "/js/assets/mechass.png";
            this.sprites[0] = new Sprite(300, 500, imgMechaEnemy, this, this.zBuffer, this.context);
            this.sprites[1] = new Sprite(200, 450, imgOfficerEnemy, this, this.zBuffer, this.context);
            this.sprites[2] = new Sprite(300, 350, imgOfficerEnemy, this, this.zBuffer, this.context);

            for (let idx = 0; idx < this.sprites.length; idx++) {
                this.sprites[idx].drawSprite();        
            }            
        }
        // Atualiza os raios
        for (let index = 0; index < this.numRays; index++) {
        // for (let index = 0; index < 10; index++) {
            this.rays[index].setAngle(this.turnAngle + (index * this.increaseAngulo));
            this.rays[index].setPosition(this.x, this.y);
            if (miniMapa){
                this.rays[index].draw();
            } else {
                this.rays[index].wallRender();
            }

        }
        
    }    
    
    draw(miniMapa) {
        this.updateMovement(miniMapa);
        if(miniMapa){
            this.context.fillStyle = playerColor;
            this.context.fillRect(this.x - 4, this.y - 4, 8,8); // passo a posicao e o tamanho é o dobro da velocidade

            // Draw line wich player is pointing to
            var fovX = this.x + (Math.cos(this.turnAngle) * 10);
            var fovY = this.y + (Math.sin(this.turnAngle) * 10);
            
            // it should dow a line from to player and forward where is looking at        
            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(fovX, fovY);
            this.context.strokeStyle = '#AAA';
            this.context.stroke();        
        }
    }
}
