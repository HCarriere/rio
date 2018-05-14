import * as graphic from '../graphics/base';
import {constrain } from '../utils';

const TILE_MODE = {
    SOLID: 1,
}

export default class Grid {

    /**
     * @param {*} gridArray 2 dimensional integer array
     */
    constructor(gridArray) {
        this.gridArray = gridArray;
        this.width = gridArray[0].length;
        this.height = gridArray.length;
    }

    draw(camera, tileSize) {
        graphic.strokeStyle('white');
        for(let i=constrain(camera.y/tileSize,0,this.height-1) | 0; 
            i<=constrain((camera.y+camera.height)/tileSize,0,this.height-1); 
            i++) {
            for(let j=constrain(camera.x/tileSize,0,this.width-1) | 0; 
                j<=constrain((camera.x+camera.width)/tileSize,0,this.width-1); 
                j++) {
                if(this.gridArray[i][j] > 0) {
                    graphic.strokeRect(j*tileSize-camera.x, i*tileSize-camera.y, tileSize, tileSize);
                }
            }
        }
    }

    isSolid(x, y) {
        if(y < 0 || x < 0 || x >= this.width || y >= this.height) {
            return true;
        }
        if(this.gridArray[y][x] == TILE_MODE.SOLID) {
            return true;
        }
        return false;
    }
}
