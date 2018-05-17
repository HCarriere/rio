import PhysicObject, { ORIENTATION } from './physicobject';
import * as graphic from '../graphics/base';
import { debugEnabled } from '../debug';
import { ACTIONS } from '../controls/controller';

const BASE_JUMP_TIME = 7; // frames
const AIR_MOVE_REDUCTION_COEF = 3;

/**
 * PC & NPC
 */
export default class Character extends PhysicObject {

    constructor(id, charInfo) {
        super(charInfo.coord, charInfo.size);

        this.name = charInfo.name || 'unknown';
        this.id = id || Math.floor(Math.random()*99999999); // random enough?

        // debug purpose
        this.color = graphic.getRandomColor();

        this.facing = ORIENTATION.RIGHT; // default

        this.maxJumps = 1;
        this.jumpForce = 1.5;
        this.jumpAmount = this.maxJumps;
        this.jumpTime = BASE_JUMP_TIME;

        this.acceleration = 3;
        this.speedLimit = 10; // px / frame

    }

    draw(camera) {
        graphic.fillStyle(this.color);
        graphic.rect(
            this.coord.x - this.size.width/2 - camera.x, 
            this.coord.y - this.size.height/2 - camera.y, 
            this.size.width, 
            this.size.height);
        
        if(debugEnabled()) {
            // debug: draw collision points. TODO delete me
            graphic.fillStyle('red');
            for(let point of this.collisionPoints) {
                graphic.rect(
                    this.coord.x - camera.x + point.modX - 1, 
                    this.coord.y - camera.y + point.modY - 1, 
                    3,3);
            }
            // debug: draw velocity
            graphic.strokeStyle('red');
            graphic.stroke(
                this.coord.x-camera.x, this.coord.y-camera.y,
                this.coord.x-camera.x+this.velocity.x, this.coord.y-camera.y);
            graphic.strokeStyle('green');
            graphic.stroke(
                this.coord.x-camera.x, this.coord.y-camera.y,
                this.coord.x-camera.x, this.coord.y-camera.y + this.velocity.y);

            // debug: show coord
            graphic.fillStyle('white');
            graphic.textAlign('center', 'bottom');
            graphic.textStyle('10px monospace');
            graphic.text('x:'+this.coord.x+' - y:'+this.coord.y, this.coord.x-camera.x, this.coord.y-camera.y-this.size.height/2-5);
            graphic.text('vx:'+this.velocity.x+' - vy:'+this.velocity.y, this.coord.x-camera.x, this.coord.y-camera.y-this.size.height/2+5);

            // debug: show sides touching
            graphic.fillStyle('purple');
            if(this.isTouchingSide(ORIENTATION.TOP)) { // top
                graphic.rect(this.coord.x - this.size.width/2 - camera.x, this.coord.y - this.size.height/2 - camera.y - 2, this.size.width, 2);
            }
            if(this.isTouchingSide(ORIENTATION.RIGHT)) { // right
                graphic.rect(this.coord.x + this.size.width/2 - camera.x, this.coord.y - this.size.height/2 - camera.y, 2, this.size.height);
            }
            if(this.isTouchingSide(ORIENTATION.BOTTOM)) { // bottom
                graphic.rect(this.coord.x - this.size.width/2 - camera.x, this.coord.y + this.size.height/2 - camera.y, this.size.width, 2);
            }
            if(this.isTouchingSide(ORIENTATION.LEFT)) { // left
                graphic.rect(this.coord.x - this.size.width/2 - camera.x - 2, this.coord.y - this.size.height/2 - camera.y, 2, this.size.height);
            }

            // debug: facing
            graphic.fillStyle('yellow');
            if(this.getFacing() == ORIENTATION.RIGHT) {
                graphic.rect(
                    this.coord.x - camera.x + this.size.width/2 - 3, 
                    this.coord.y - camera.y - this.size.height/4, 
                    3,3);
            }
            if(this.getFacing() == ORIENTATION.LEFT) {
                graphic.rect(
                    this.coord.x - camera.x - this.size.width/2 + 3, 
                    this.coord.y - camera.y - this.size.height/4, 
                    3,3);
            }
        }
    }

    update(zone) {
        this.applyPhysic(zone);

        let inputs = this.getActiveInputStates();
        if(inputs.m) {
            this.move(inputs.m);
        }
        if(inputs[ACTIONS.JUMP]) {
            this.setIsJumping(true);
        } else {
            this.setIsJumping(false);
        }
    }

    move(axe) {
        if(axe.intensity > 0) {
            if(axe.angle == 90) {
                // right
                if(this.isTouchingSides()) {
                    this.velocity.x += this.acceleration;
                } else {
                    this.velocity.x += this.acceleration/AIR_MOVE_REDUCTION_COEF;
                }
                    this.facing = ORIENTATION.RIGHT;
            }
            if(axe.angle == 270) {
                // left
                if(this.isTouchingSides()) {
                    this.velocity.x -= this.acceleration;
                } else {
                    this.velocity.x -= this.acceleration/AIR_MOVE_REDUCTION_COEF;
                }
                this.facing = ORIENTATION.LEFT;
            }
        }

        // speed limit
        if(this.velocity.x > this.speedLimit) this.velocity.x = this.speedLimit;
        if(this.velocity.x < -this.speedLimit) this.velocity.x = -this.speedLimit;
    }

    jump() {
        if(this.jumpAmount > 0) {
            this.velocity.y = -this.jumpForce;
            this.jumpAmount -=1;
        }
    }

    setIsJumping(jumping) {
        if(jumping) {
            // jumping
            if(this.jumpAmount > 0 && this.jumpTime > 0) {
                if(this.jumpTime == BASE_JUMP_TIME) {
                    this.velocity.y = 0;
                }
                this.jumpTime --;
                this.velocity.y -= this.jumpForce * (this.jumpTime/2+1);
            }
        } else {
            if(this.isTouchingSides()) {
                // not jumping & touching sides
                this.jumpAmount = this.maxJumps;
                this.jumpTime = BASE_JUMP_TIME;
            } else {
                // not jumping & in the air
                if(this.jumpTime < BASE_JUMP_TIME) {
                    this.jumpTime = 0;
                }
                if(this.jumpAmount > 0 && this.jumpTime == 0) {
                    this.jumpAmount --;
                    this.jumpTime = BASE_JUMP_TIME;
                }
            }
        }
    }

    isTouchingSides() {
        return this.isTouchingSide(ORIENTATION.BOTTOM) || 
        this.isTouchingSide(ORIENTATION.LEFT) || 
        this.isTouchingSide(ORIENTATION.RIGHT);
    }

    /**
     * Returns the orientation of the character (left / right)
     * @returns {Number} orientation
     */
    getFacing() {
        return this.facing;
    }

    updateFromNetwork(inputs) {

    }

    getActiveInputStates() {
        
    }

}