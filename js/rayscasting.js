// Variáveis globais
var canvas;
var context;
const FPS = 60;
var cenario;
var player;

// ----------- Cores ----------- 
const wallColor = '#000'; // Preto para as paredes
const groundColor = '#777'; // Cinza para o chão
const playerColor = '#FFF'; // Branco para jogador
// ----------- Cores ----------- 

// ----------- MAPA ----------- 
var nivel1 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
// ----------- MAPA ----------- 

// Dimensões do Canvas
const canvasWidth = 800;
const canvasHeight = 600;

// ----------- EVENTOS DO TELCADO ----------- 
document.addEventListener('keydown', (key) => {
   switch (key.keyCode) {
    case 87:
        // move up
        player.moveUp();
        break;
    case 65:
        // move left
        player.moveLeft();
        break;
    case 83:
        // move down
        player.moveDown();
        break;
    case 68:
        // move rigth
        player.moveRigth();
        break;
    default:
        break;
   }
});

document.addEventListener('keyup', (key) => {    
    switch (key.keyCode) {
     case 87:
         player.releaseMove();
         break;
     case 65:
         // stop move left
         player.releaseTurn();
         break;
     case 83:
         // stop move down
         player.releaseMove();
         break;
     case 68:
         // stop move rigth
         player.releaseTurn();
         break;
     default:
         break;
    }
 });


function init() {
    console.log("Início do Jogo");
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Configuração de dimensões do Canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    cenario = new Level(canvas, context, nivel1);
    player = new Player(context, cenario, 450, 250); // 300, 200 é a posicao inicial

    // Inicia o jogo
    setInterval(() => {
        game();
    }, 1000 / FPS);
}

function apagarTela() {
    // Limpa o canvas sem redefinir suas dimensões
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function game() {
    apagarTela();
    cenario.draw();
    player.draw();
}

class Level {
    constructor(canvas, ctx, array) {
        this.canvas = canvas;
        this.context = ctx;
        this.matriz = array;

        // Dimensões do Mapa
        this.heightM = this.matriz.length; // Quantidade de linhas
        this.widthM = this.matriz[0].length; // Quantidade de colunas

        // Dimensões de cada tile
        this.heightT = canvas.height / this.heightM;
        this.widthT = canvas.width / this.widthM;
    }

    draw() {
        for (var y = 0; y < this.heightM; y++) {
            for (var x = 0; x < this.widthM; x++) {
                const color = this.matriz[y][x] === 1 ? wallColor : groundColor;

                this.context.fillStyle = color;
                this.context.fillRect(
                    x * this.widthT, 
                    y * this.heightT, 
                    this.widthT, 
                    this.heightT
                );
            }
        }
    }
}


class Player {
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
        
        this.x = newX;
        this.y = newY;
        
        this.turnAngle += this.turn * this.turnSpeed;
    }
    
    draw() {
        this.updateMovement();
        this.context.fillStyle = playerColor;
        this.context.fillRect(this.x - 4, this.y - 4 ,8 ,8); // passo a posicao e o tamanho é o dobro da velocidade

        // Draw line wich player is pointing to
        var fovX = this.x + (this.move * Math.cos(this.turnAngle) * 150);
        var fovY = this.y + (this.move * Math.sin(this.turnAngle) * 150);
        // it should dow a line from to player and forward where is looking at
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(fovX, fovY);
        this.context.strokeStyle = '#AAA';
        this.context.stroke();



    }
}
