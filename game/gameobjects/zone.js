import Grid from './grid';

/**
 * Draws:
 * .Grid
 * .Objects
 * .Creatures
 */
export default class Zone {
    
    /**
     * @param {String} name 
     * @param {Object} properties 
     * @param {Array[Array]} grid 
     * @param {Array} objects 
     * @param {Array} creatures 
     */
    constructor(name, properties, grid, objects, creatures) {
        console.log(name);
        console.log(properties);
        console.log(grid);
        this.name = name || 'zone test';
        this.properties = properties || {
            tileSize: 32,
        };
        this.grid = new Grid(grid || getEmptyGrid());
        this.objects = objects || [];
        this.creatures = creatures || [];

        this.width = this.grid.width*this.properties.tileSize;
        this.height = this.grid.height*this.properties.tileSize;

        console.log('zone created : '+name);
        console.log('   width: '+this.width);
        console.log('   height: '+this.height);
    }
    

    draw(camera) {
        // grid        
        this.grid.draw(camera, this.properties.tileSize);

        // objects

        // creatures

    }

    update() {
        // grid        
        
        // objects

        // creatures
    }

}

/**
 * Not empty, but the test one (with walls)
 * Exists in client code only if zone data are invalids.
 * @returns {Array} grid;
 */
function getEmptyGrid() {
    const width = 30;
    const height = 10;

    let grid = [];

    for(let i=0; i<height; i++) {
        grid[i] = [];
        for(let j=0; j<width; j++) {
            if(i>=height-2 || j<=1 || j==width-1) {
                grid[i][j] = 1;    
            } else {
                grid[i][j] = 0;
            }
        }
    }
    return grid;
}