import { Level } from './Level.js';
import { Player } from './Player.js';

// Variáveis globais
var canvas2d;
var context2d;
var canvas3d;
var context3d;
const FPS = 50;
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
export const halfFov = FOV / 2;

// Função para limpar o canvas
function apagarTela() {
    // Limpa o canvas sem redefinir suas dimensões
    context2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
    context3d.clearRect(0, 0, canvas3d.width, canvas3d.height);
}

// Função principal do jogo
function game() {
    apagarTela();
    cenario2d.draw();
    player2d.draw(true);
    player3d.draw(false);

   
}

// Inicializa o jogo
function init() {
    console.log("Início do Jogo");

    // Configuração 2D
    canvas2d = document.getElementById('canvas2d');
    context2d = canvas2d.getContext('2d');

    // Configuração 3D
    canvas3d = document.getElementById('canvas3d');
    context3d = canvas3d.getContext('2d');

    // Configuração de dimensões dos Canvas
    canvas2d.width = canvasWidth;
    canvas2d.height = canvasHeight;
    canvas3d.width = canvasWidth;
    canvas3d.height = canvasHeight;

    // Inicializa cenário e jogadores
    cenario2d = new Level(canvas2d, context2d, nivel1);
    cenario3d = new Level(canvas3d, context3d, nivel1);
    player2d = new Player(context2d, cenario2d, 250, 100); // Posição inicial: 250, 100
    player3d = new Player(context3d, cenario3d, 250, 100);

    // Eventos de teclado
    document.addEventListener('keydown', (key) => {
        switch (key.keyCode) {
            case 87: // W - move para cima
                player2d.moveUp();
                player3d.moveUp();
                break;
            case 65: // A - move para esquerda
                player2d.moveLeft();
                player3d.moveLeft();
                break;
            case 83: // S - move para baixo
                player2d.moveDown();
                player3d.moveDown();
                break;
            case 68: // D - move para direita
                player2d.moveRigth();
                player3d.moveRigth();
                break;
            default:
                break;
        }
    });

    document.addEventListener('keyup', (key) => {
        switch (key.keyCode) {
            case 87: // W
            case 83: // S
                player2d.releaseMove();
                player3d.releaseMove();
                break;
            case 65: // A
            case 68: // D
                player2d.releaseTurn();
                player3d.releaseTurn();
                break;
            default:
                break;
        }
    });    

    // Inicia o loop do jogo
    setInterval(game, 1000 / FPS);
}

// Expõe a função init ao escopo global
window.init = init;
