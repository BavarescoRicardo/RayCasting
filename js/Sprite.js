import { FOV, halfFov } from './rayscasting.js';
export class Sprite {
    constructor(x, y, image, player, zBuffer, context){
        this.x = x;
        this.y = y;
        this.image = image;
        this.distance = 0;
        this.angle = 0;
        this.visible = false;
        this.player = player;
        this.zBuffer = zBuffer;
        this.ctx = context;

    }

    calcAngle(){
        var vectX = this.x - this.player.x;
        var vectY = this.y - this.player.y;
        var anglePlayerObject = Math.atan2(vectY, vectX);
        var diffAngle = this.player.turnAngle - anglePlayerObject;

        // Normalize diffAngle for turn over 180 degree
        if (diffAngle < -1*(Math.PI))
            diffAngle += 2.0 * Math.PI;
        if (diffAngle > Math.PI)
            diffAngle += 2.0 * Math.PI;

        if(diffAngle < halfFov){
            this.visible = true;
        } else {
            this.visible = false;
        }
    }
    
    calcDistance() {
        this.distance = this.player.distanceBetween(this.player.x, this.player.y, this.x, this.y);
    }

    updateData() {
        this.calcAngle();
        this.calcDistance();
    }

    drawSprite() {
        this.updateData();

        if(this.visible){
            var tileHeight = 500;
            var distanceProjection = 300 / Math.tan(FOV / 2);
            var spriteHeight = tileHeight / this.distance * distanceProjection;

            // Calc where draw begin and end
            var y0 = parseInt(tileHeight/2) - parseInt(spriteHeight/2);
            var y1 = y0 + spriteHeight;
            var textureWidhtAux = 64;
            var textureHeightAux = 64;

            var textureWidht = y0- y1;
            var textureHeight = textureWidhtAux; 
            
            var viewDistance = 500;
            var dx = this.player.x - this.x;
            var dy = this.player.y - this.y;
            var spriteAngle = Math.atan2(dy, dx) - this.player.turnAngle;

            // ajuster por aqui para sprite aparecer perto?
            var x0 = Math.tan(spriteAngle) * viewDistance;
            var x1 = (30 + x0 - textureWidht/2);
            var columnWidth = textureHeight/textureHeightAux;

            // Effectly draw sprite column by column 
            for (let i = 0; i < textureWidht; i++) {
                for (let j = 0; j < columnWidth; j++) {
                    var x = parseInt(x1 + ((i-1)*columnWidth)+j);

                    // Verifica se algum obstaculo cobre parte do sprite
                    if (this.zBuffer[x] > this.distance) {
                        this.ctx.drawImage(this.image, i, 0, 1, textureHeight-1, x, y1, 1, textureHeightAux);
                    }
                    
                }
                
            }



        }
    }

 
}
