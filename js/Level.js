import { wallColor, groundColor } from './rayscasting.js';
export class Level {
    constructor(canvas, ctx, array) {
        this.canvas = canvas;
        this.context = ctx;
        this.matriz = array;

        // Dimensões do Mapa
        this.heightM = this.matriz.length -1; // Quantidade de linhas
        this.widthM = this.matriz[0].length; // Quantidade de colunas

        // Dimensões de cada tile
        this.heightT = canvas.height / this.heightM;
        this.widthT = canvas.width / this.widthM;
    }

    collision(x, y) {
        // Valide se x e y estão dentro dos limites do mapa
        if (x < 0 || x >= this.widthM || y < 0 || y >= this.heightM) {
            return true; // Considere como uma colisão fora do mapa
        }
        return this.matriz[y][x] === 1; // Verifique se é uma parede
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
