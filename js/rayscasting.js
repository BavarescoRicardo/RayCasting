// Variáveis globais
var canvas;
var context;
const FPS = 60;
var cenario;

// ----------- Cores ----------- 
const wallColor = '#000'; // Preto para as paredes
const groundColor = '#777'; // Cinza para o chão
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

function init() {
    console.log("Início do Jogo");
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Configuração de dimensões do Canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    cenario = new Level(canvas, context, nivel1);

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
        
    }
}
