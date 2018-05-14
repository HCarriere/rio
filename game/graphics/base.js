import { canvas } from '../index';

function fillStyle(str) {
    canvas.ctx.fillStyle = str;
}


function strokeStyle(str) {
    canvas.ctx.strokeStyle = str;
}


function rect(x, y, wid, hei) {
    canvas.ctx.fillRect(x | 0,y | 0,wid,hei);
}


function strokeRect(x, y, wid, hei) {
    canvas.ctx.strokeRect(x,y,wid,hei);
}


function circle(x, y, radius) {
    canvas.ctx.arc(x, y, radius, 0, Math.TWO_PI);
    canvas.ctx.fill();
    canvas.ctx.stroke();
}


function stroke(x, y, x2, y2) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x, y);
    canvas.ctx.lineTo(x2, y2);
    canvas.ctx.stroke();
    canvas.ctx.moveTo(0, 0);
}


function image(image, x, y) {
    canvas.ctx.drawImage(image, x, y);
}


function text(str, x, y) {
    canvas.ctx.fillText(str, x, y)
}


function textStyle(str) {
    canvas.ctx.font = str;
}


function textAlign(vertical, horizontal) {
    canvas.ctx.textAlign = vertical;
    canvas.ctx.textBaseline = horizontal;
}


function setBackground(image) {
    
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  

export {
    fillStyle,
    strokeStyle,
    rect,
    strokeRect,
    circle,
    stroke,
    image,
    text,
    textStyle,
    textAlign,
    setBackground,
    getRandomColor,
}
