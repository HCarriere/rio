/**
 * Every objects that have physic on them should extend this class.
 * Including, but not limited to:
 * - Characters (PC & NPC..)
 * - Some objects
 * 
 * A physic object can't be walked on.
 * 
 * Here are the things a PhysicObject can walk on:
 * - Grid
 * - moving plateforms
 */

import { constrain } from '../utils';

const SPEED_LIMIT = {
    X:20,
    Y:20,
}

const ORIENTATION = {
    TOP: 1,
    RIGHT: 2,
    BOTTOM: 3,
    LEFT: 4,
};

const GRAVITY = {
    X: 0,
    Y: 1.5,
}

const FRICTION = {
    AIR: 0.1,
    GROUND: 2.5, // if higher or equal tu char acceleration, char won't move
    WALL: 1.2,// If higher or equal than gravity, you don't slide off of the wall.
}

export default class PhysicObject {

    constructor(coord, size) {
        this.coord = coord || {x: 0, y: 0};
        this.size = size || {width: 30, height: 50};
        this.velocity = {x: 0, y: 0};
        this.collisionPoints = createCollisionPoints(this.size);
        this.sidesTouching = {};
    }

    applyForce(x, y) {
        this.velocity.x += x;
        this.velocity.y += y;
    }

    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    applyPhysic(zone) {
        this.sidesTouching = {};

        // apply gravity
        this.applyForce(GRAVITY.X, GRAVITY.Y);

        // collisions
        for(let point of this.collisionPoints) {
            for(let ori of point.orientations) {
                // Check collisions with grid
                let col = getCollisionDistanceWithTerrain(point, ori, this, zone);
                if(col) {
                    this.sidesTouching[ori] = true;
                    this.setVelocity(col.x, col.y);
                }
            }
        }

        // friction
        applyFriction(this);

        // constrain velocity
        this.velocity.x = constrain(this.velocity.x, -SPEED_LIMIT.X, SPEED_LIMIT.X);
        this.velocity.y = constrain(this.velocity.y, -SPEED_LIMIT.Y, SPEED_LIMIT.Y);
        /*let linearSpeed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        if(linearSpeed > SPEED_LIMIT) {
            this.velocity.x = (this.velocity.x / linearSpeed) * SPEED_LIMIT;
            this.velocity.y = (this.velocity.y / linearSpeed) * SPEED_LIMIT;
        }*/


        // update position
        this.coord.x += this.velocity.x;
        this.coord.y += this.velocity.y;

    }

    isTouchingSide(orientation) {
        if(this.sidesTouching[orientation]) {
            return true;
        }
        return false;
    }
}


function applyFriction(obj) {
    // horizontal friction
    let friction;
    if(obj.isTouchingSide(ORIENTATION.BOTTOM) || obj.isTouchingSide(ORIENTATION.TOP)) {
        friction = FRICTION.GROUND;
    } else {
        friction = FRICTION.AIR;
    }
    // apply friction on x
    if(obj.velocity.x >= friction) {
        obj.velocity.x -= friction;
    } else if(obj.velocity.x <= -friction){
        obj.velocity.x += friction;
    } else {
        obj.velocity.x = 0;
    }
    // vertical friction
    if(obj.isTouchingSide(ORIENTATION.LEFT) || obj.isTouchingSide(ORIENTATION.RIGHT)) {
        friction = FRICTION.WALL;
    } else {
        friction = FRICTION.AIR;
    }
    // apply friction on y
    if(obj.velocity.y >= friction) {
        obj.velocity.y -= friction;
    } else if(obj.velocity.y <= -friction){
        obj.velocity.y += friction;
    } else {
        obj.velocity.y = 0;
    }
}


/**
 * return false if no collision next tick.
 * return distance between collision point and point otherwise , as a vector (x, y)
 * @param {Object} point collision point
 * @param {Number} orientation 
 * @param {PhysicObject} obj 
 */
function getCollisionDistanceWithTerrain(point, orientation, obj, zone) {
    if(orientation == ORIENTATION.BOTTOM) {
        let xModifier = point.modX>0?-1:1;
		if(isCollidedWithTerrain(point.modX + obj.coord.x + xModifier,(point.modY + obj.coord.y)+obj.velocity.y, zone)) {
            // onTouchGround(obj);
			return {
				x: obj.velocity.x,
                y: Math.floor((point.modY + obj.coord.y+obj.velocity.y)/zone.properties.tileSize) * zone.properties.tileSize - (point.modY + obj.coord.y),
			};			
		}
	} else if(orientation == ORIENTATION.RIGHT) {
        let yModifier = point.modY>0?-1:1;
		if(isCollidedWithTerrain(point.modX + obj.coord.x+obj.velocity.x,point.modY + obj.coord.y+ yModifier, zone)) {
			return {
				x: Math.floor((point.modX + obj.coord.x+obj.velocity.x)/zone.properties.tileSize) * zone.properties.tileSize - (point.modX + obj.coord.x),
                y: obj.velocity.y,
			};			
		}
    } else if(orientation == ORIENTATION.TOP) {
        let xModifier = point.modX>0?-1:1;
		if(isCollidedWithTerrain(point.modX + obj.coord.x + xModifier,point.modY + obj.coord.y+obj.velocity.y, zone)) {
            // debugger;
			return {
				x: obj.velocity.x,
                y: Math.floor((point.modY + obj.coord.y+obj.velocity.y)/zone.properties.tileSize) * zone.properties.tileSize + zone.properties.tileSize - (point.modY + obj.coord.y),
			};			
		}
    } else if(orientation == ORIENTATION.LEFT) {
        let yModifier = point.modY>0?-1:1;
		if(isCollidedWithTerrain(point.modX + obj.coord.x+obj.velocity.x,point.modY + obj.coord.y+yModifier, zone)) {
			return {
				x: Math.floor((point.modX + obj.coord.x+obj.velocity.x)/zone.properties.tileSize) * zone.properties.tileSize + zone.properties.tileSize- (point.modX + obj.coord.x),
                y: obj.velocity.y,
			};			
		}
	}
	return false;
}

function isCollidedWithTerrain(x, y, zone){
	// out of bound
	if(x<0 || y<0 || x/zone.properties.tileSize>zone.width || y/zone.properties.tileSize>zone.height) {
		return false;
	}
    // tiles
    if(zone.grid.isSolid(x / zone.properties.tileSize | 0, y / zone.properties.tileSize | 0)) {
        return true;
    }

    return false;
}

/**
 * Returns new collision points for the model.
 * it creates points on the sides, if size > 1 (otherwise only 1 point)
 * if size > 1, it creates points on the corners of the model
 * @param {Object} size 
 * @returns {Array} collisionPoints
 */
function createCollisionPoints(size) {
    let points = [];
    // top left
    points.push({
        modX: -size.width/2,
        modY: -size.height/2,
        orientations: [ORIENTATION.TOP, ORIENTATION.LEFT]
    });
    if(size.width > 1) {
        // top right
        points.push({
            modX: size.width/2,
            modY: -size.height/2,
            orientations: [ORIENTATION.TOP, ORIENTATION.RIGHT]
        });
    }
    if(size.height > 1) {
        // bottom left
        points.push({
            modX: -size.width/2,
            modY: size.height/2,
            orientations: [ORIENTATION.BOTTOM, ORIENTATION.LEFT]
        });
    }
    // bottom right
    points.push({
        modX: size.width/2,
        modY: size.height/2,
        orientations: [ORIENTATION.BOTTOM, ORIENTATION.RIGHT]
    });

    return points;
}

function isPointColliding(obj, point, zone) {
    if(zone.grid.isSolid(
         (obj.coord.x + point.modX / zone.properties.tileSize) | 0,
         ((obj.coord.y + point.modY + obj.velocity.y) / zone.properties.tileSize) | 0
        )) {
        return true;
    }
    return false;
}


export {
    ORIENTATION
}