// Variaveis globais
var canvas;
var context;
const FPS = 60;
var cenario;

// ----------- Cores ----------- 
const wallColor = '#000';
const groundColor = '#777';
// ----------- Cores ----------- 

// ----------- MAPA ----------- 
var nivel1 = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
];

// ----------- MAPA ----------- 

// Dimensoes Cenario
const canvaWidth = 600;
const canvaHeigth = 600;

function init() {
    console.log("Inicio");
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Modificadores de dimensoes
    canvas.width = canvaWidth;
    canvas.heigth = canvaHeigth;

    cenario = new Level(canvas, context, nivel1);

    setInterval(() =>
        {this.game();

        }, 1000/FPS
    );
}

function apagarTela(){
        // Apagar todos os desenhos da tela
        // ....

        canvas.width = canvaWidth;
        canvas.heigth = canvaHeigth;

}

function game() {
    this.apagarTela();
    cenario.draw();
}




class Level {
    constructor(canvas, ctx, array){
        this.canvas = canvas;
        this.context = ctx;
        this.matriz = array;

        // Dimensoes Cenario
        this.heigthM = this.matriz.length;
        this.widthM = this.matriz[0].length;

        // ------- Dimensao em px ------- 
        this.heigthC = this.canvas.heigth;
        this.widthC = this.canvas.width;

        // ------- Dimensao de cada bloco ------- 
        this.heigthT = parseInt(this.heigthC / this.heigthM);
        this.widthT = parseInt(this.widthC / this.widthM);


        // console.log(this.heigthT);

    }

    draw() {
        var color;

        for (var y = 0; y < this.heigthM; y++) {
            //console.log(this.heigthC);
            for (var x = 0; x < this.widthM; x++) {
                if (this.matriz[y][x] == 1) {
                    color = wallColor;                    
                } else {
                    color = groundColor;
                }

                this.context.fillStyle = color;
                this.context.fillRect(x * this.widthT, y * this.heigthT, this.widthT, this.heigthT);                
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