import { Level } from './Level.js';
import { Player } from './Player.js';

// Variáveis globais
var canvas;
var context;
const FPS = 60;
var cenario;
var player;

// ----------- Cores ----------- 
export const wallColor = '#000'; // Preto para as paredes
export const groundColor = '#777'; // Cinza para o chão
export const playerColor = '#FFF'; // Branco para jogador
export const sizeTile = 50;
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

// Expõe a função init ao escopo global
window.init = init;
