import { wallColor, groundColor } from './rayscasting.js';
export class Level {
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

    collision(x, y) {
        console.log(`Checking collision at x: ${x}, y: ${y}`);
        if (y < 0 || y >= this.matriz.length || x < 0 || x >= this.matriz[0].length) {
            console.warn(`Out of bounds: a matirz length: ${this.matriz.length} x: ${x}, y: ${y}`);
            return false;
        }

        return this.matriz[y][x] === 1; // Retorna true se houver parede
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
