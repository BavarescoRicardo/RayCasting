import { playerColor, canvasHeight, canvasWidth, FOV, halfFov } from './rayscasting.js';
import { Ray } from './Ray2d.js';
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

        
        // Adicionar raios para todo campo de visao do personagem
        this.numRays = canvasWidth;
        this.rays = []; 
        // calcular angulo para cada raio
        this.increaseAngulo = this.convertDegres(FOV / this.numRays);
        // Ajuste o ângulo inicial corretamente
        this.initialAngle = this.turnAngle - halfFov;
        this.rayAngle = this.initialAngle;
        for (let index = 0; index < this.numRays; index++) {
        // for (let index = 0; index < 10; index++) {
            this.rays[index] = new Ray(this.context, this.cenario, this.x, this.y, this.turnAngle, this.rayAngle, index);   
            this.rayAngle += this.increaseAngulo;
        }

    }

    convertDegres(angulo){
        return angulo * (Math.PI / 180);
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
    
        // Atualiza os raios
        for (let index = 0; index < this.numRays; index++) {
            // Distribua os raios com base no ângulo central
            this.rays[index].setAngle(this.turnAngle - halfFov + (index * this.increaseAngulo));
            this.rays[index].setPosition(this.x, this.y);

            if (miniMapa) {
                this.rays[index].draw();
            } else {
                this.rays[index].wallRender();
            }
        }

        
    }
    
    
    draw(miniMapa) {
        this.updateMovement(miniMapa);
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
