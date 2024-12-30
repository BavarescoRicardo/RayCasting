import { Level } from './Level.js';
import { Player } from './Player.js';

export class Hud {
    constructor() {
        console.log("Hud do Jogo");

        // Configuração do canvas e contexto 2D
        this.canvasHud = document.getElementById('hud');
        this.contextHud = this.canvasHud.getContext('2d');

        // Carregar a imagem
        this.image = new Image();
        // this.image.src = "/js/assets/huddota-edt.png";

        // Desenhar o HUD após a imagem ser carregada
        this.image.onload = () => {
            this.drawHud();
        };
    }

    drawHud() {
        // Limpar o canvas
        this.contextHud.clearRect(0, 0, this.canvasHud.width, this.canvasHud.height);

        // Desenhar a imagem no canvas
        this.contextHud.drawImage(this.image, 0, 0, this.canvasHud.width, this.canvasHud.height);

        // Adicionar texto ou outros elementos, se necessário
        // this.contextHud.font = '20px Arial';
        // this.contextHud.fillStyle = 'white';
        // this.contextHud.fillText('HUD: Informações do Jogo', 10, 30);
    }
}
