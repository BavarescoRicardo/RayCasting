import { Level } from './Level.js';
import { Player } from './Player.js';
import { Hud } from './Hud.js';

// Variáveis globais
var canvas2d, context2d, canvas3d, context3d, legend;
var cenario2d, cenario3d, player2d, player3d;
const FPS = 50;
var cenario2d;
var cenario3d;
var player2d;
var player3d;
var hud;
var zBuffer = [];
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

    legend = document.getElementById('legend');

    // Configuração de dimensões dos Canvas
    canvas2d.width = canvasWidth;
    canvas2d.height = canvasHeight;
    canvas3d.width = canvasWidth;
    canvas3d.height = canvasHeight;

    // Inicializa cenário e jogadores
    cenario2d = new Level(canvas2d, context2d, nivel1);
    cenario3d = new Level(canvas3d, context3d, nivel1);
    player2d = new Player(context2d, cenario2d, 250, 100, zBuffer);
    player3d = new Player(context3d, cenario3d, 250, 100, zBuffer);
    hud = new Hud(player2d, player3d);
    
    // Eventos de teclado
    document.addEventListener('keydown', (key) => {
        switch (key.keyCode) {
            case 87: player2d.moveUp(); player3d.moveUp(); break; // W
            case 65: player2d.moveLeft(); player3d.moveLeft(); break; // A
            case 83: player2d.moveDown(); player3d.moveDown(); break; // S
            case 68: player2d.moveRigth(); player3d.moveRigth(); break; // D
        }
    });

    document.addEventListener('keyup', (key) => {
        switch (key.keyCode) {
            case 87:
            case 83: player2d.releaseMove(); player3d.releaseMove(); break;
            case 65:
            case 68: player2d.releaseTurn(); player3d.releaseTurn(); break;
        }
    });

    // Evento de mouse dentro do init
    canvas2d.addEventListener('mousemove', (event) => {
        const rect = canvas2d.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        let rayFound = false;

        for (const ray of player2d.rays) {
            const distance = pointToSegmentDistance(mouseX, mouseY, ray.x, ray.y, ray.wallHitX, ray.wallHitY);
            if (distance < 5) {
                rayFound = true;
                legend.style.display = 'block';
                legend.style.left = `${event.clientX + 10}px`;
                legend.style.top = `${event.clientY + 10}px`;
                legend.innerHTML = `
                    <strong>Ray Info:</strong><br>
                    Angle: ${(ray.turnAngle * 180 / Math.PI).toFixed(2)}°<br>
                    Distance: ${ray.distance.toFixed(2)}<br>
                    Posição: ${'X: ' + ray.x + 'Y: ' + ray.y }<br>
                    Lado x: ${ray.left ? 'esquerdo' : 'direito'}<br>
                    Lado y: ${ray.down ? 'baixo' : 'cima'}<br>
                    Wall: (${ray.wallHitX.toFixed(2)}, ${ray.wallHitY.toFixed(2)})
                `;            
                break;
            }
        }

        if (!rayFound) legend.style.display = 'none';
    });

    canvas2d.addEventListener('mouseout', () => legend.style.display = 'none');

    // Inicia o loop do jogo
    setInterval(game, 1000 / FPS);
}

// Calcula a distância entre um ponto e um segmento de reta
function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
    const dot = A * C + B * D, lenSq = C * C + D * D, param = dot / lenSq;
    if (param < 0 || lenSq === 0) return Math.hypot(px - x1, py - y1);
    if (param > 1) return Math.hypot(px - x2, py - y2);
    const xx = x1 + param * C, yy = y1 + param * D;
    return Math.hypot(px - xx, py - yy);
}

// Exponha ao escopo global
window.init = init;
