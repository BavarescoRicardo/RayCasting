import { Level } from './Level.js';
import { Player } from './Player.js';

// Variáveis globais
var canvas2d;
var context2d;
var canvas3d;
var context3d;
const FPS = 30;
var cenario2d;
var cenario3d;
var player2d;
var player3d;

// ----------- Cores ----------- 
export const wallColor = '#000'; // Preto para as paredes
export const groundColor = '#777'; // Cinza para o chão
export const playerColor = '#FFF'; // Branco para jogador
export const sizeTile = 60;
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
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
// ----------- MAPA ----------- 

// Dimensões do Canvas
export const canvasWidth = 600;
export const canvasHeight = 600;
export const FOV = 60;
export const halfFov = FOV/2;

// ----------- EVENTOS DO TELCADO ----------- 
document.addEventListener('keydown', (key) => {
   switch (key.keyCode) {
    case 87:
        // move up
        player2d.moveUp();
        player3d.moveUp();
        break;
    case 65:
        // move left
        player2d.moveLeft();
        player3d.moveLeft();
        break;
    case 83:
        // move down
        player2d.moveDown();
        player3d.moveDown();
        break;
    case 68:
        // move rigth
        player2d.moveRigth();
        player3d.moveRigth();
        break;
    default:
        break;
   }
});

document.addEventListener('keyup', (key) => {    
    switch (key.keyCode) {
     case 87:
         player2d.releaseMove();
         player3d.releaseMove();
         break;
     case 65:
         // stop move left
         player2d.releaseTurn();
         player3d.releaseTurn();
         break;
     case 83:
         // stop move down
         player2d.releaseMove();
         player3d.releaseMove();
         break;
     case 68:
         // stop move rigth
         player2d.releaseTurn();
         player3d.releaseTurn();
         break;
     default:
         break;
    }
 });


function init() {
    console.log("Início do Jogo");
    // Configuracao 2d
    canvas2d = document.getElementById('canvas2d');
    context2d = canvas2d.getContext('2d');

    // Configuracao 3d
    canvas3d = document.getElementById('canvas3d');
    context3d = canvas3d.getContext('2d');

    // Configuração de dimensões do Canvas 2d
    canvas2d.width = canvasWidth;
    canvas2d.height = canvasHeight;

    // Configuração de dimensões do Canvas 3d
    canvas3d.width = canvasWidth;
    canvas3d.height = canvasHeight;    

    cenario2d = new Level(canvas2d, context2d, nivel1);
    cenario3d = new Level(canvas3d, context3d, nivel1);

    player2d = new Player(context2d, cenario2d, 250, 100); // 250, 100 é a posicao inicial
    player3d = new Player(context3d, cenario3d, 250, 100); // 250, 100 é a posicao inicial

    // Inicia o jogo
    setInterval(() => {
        game();
    }, 1000 / FPS);
}
function apagarTela() {
    // Limpa o canvas sem redefinir suas dimensões
    context2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
    context3d.clearRect(0, 0, canvas3d.width, canvas3d.height);
}

function game() {
    apagarTela();
    cenario2d.draw();
    player2d.draw(true);
    player3d.draw(false);
}

// Expõe a função init ao escopo global
window.init = init;