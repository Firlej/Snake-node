let canvas, ctx;

let width, height;

let windowWidth, windowHeight;

let mouseX, mouseY;
let keyCode;

let images = [];
let imagesLoaded = false;

let PI = Math.PI;
let frameCount = 0;

function setCtxByCanvasId(id) {
    canvas = document.getElementById(id);
    ctx = canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.stroke();
}

window.onload = function() {
    setCtxByCanvasId('canvas');

    addEventListeners();

    setLibValues();

    setup(function() {
        setInterval(function() {
            draw();
            frameCount++;
        }, 1000/120);
    });
}

function setLibValues() {
    width = canvas.width;
    height = canvas.height;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}
var sources = {};
function loadImages(sources) {

    var numImages = 0;
    for(src in sources) {
        numImages++;
    }
    var loadedImages = 0;
    for(src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            loadedImages++;
            if(loadedImages==numImages) {
                //console.log("Images loaded!");
                imagesLoaded = true;
            }
        };
        images[src].src = sources[src];
    }
}

function image(img, x, y, width, height) {
    ctx.drawImage(img, x, y, width, height);   
}

function resizeCanvas(width, height) {
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    canvas.width = width;
    canvas.height = height;

    setLibValues();
}

function background(color) {
    fill(color);
    rect(0, 0, canvas.width, canvas.height);
}

function font(f) {
    ctx.font = f;
}
function textAlign(a) {
    ctx.textAlign = a;
}
function text(text, x, y) {
    ctx.fillText(text, x, y);
}
function randomRgb() {
    return rgba(random(0,256),random(0,256),random(0,256));
}
function fill(color) {
    ctx.fillStyle = color;
}

function ellipse(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.fill();
}
function rect(x, y, width, height) {
    ctx.fillRect(x, y, width, height);
}
function strokeRect(x, y, width, height) {
    ctx.strokeRect(x,y,width,height);
}
function lineWidth(x) {
    ctx.lineWidth=x;
}

function rgba(r, g, b, a = 1) {
    return "rgba("+floor(r)+", "+floor(g)+", "+floor(b)+", "+a+")";
}

function hsl(h, s, l) {
    return "hsl("+floor(h)+", "+floor(s)+"%, "+floor(l)+"%)";
}

function lerp(start, end, rate) {
    return (end-start)*rate + start;
}

function floor(a) {
    return Math.floor(a);
}
function random(a, b) {
    return Math.random()*(b-a) + a;
}
function randomArray(arr) {
    if (arr.length==0) { return null; }
    return arr[floor(random(0, arr.length))];
}

function push() { ctx.save() };
function translate(x, y) { ctx.translate(x, y); }
function pop() { ctx.restore(); }

function beginShape() { ctx.beginPath(); }
function vertex(x, y) { ctx.lineTo(x, y); }
function endShape() { ctx.closePath(); ctx.stroke(); }

function stroke(color) { ctx.strokeStyle = color; }

function mousePressed() {}
function mouseReleased() {}
function windowResized() {}
function keyPressed() {}

function addEventListeners() {
    canvas.addEventListener("mousedown", mousePressed);
    canvas.addEventListener("mouseup", mouseReleased);
    canvas.addEventListener('mousemove', updateMouseMove);

    window.addEventListener("keypress", function(evt) {
        keyCode = evt.keyCode;
        keyPressed();
    });

    window.addEventListener('touchstart', function(evt) {
        updateTouchMove(evt)
        mousePressed();
    });
    window.addEventListener('touchend', mouseReleased);
    window.addEventListener('touchmove', function(evt) {
        evt.preventDefault();
        updateTouchMove(evt);
    });

    window.onresize = function(event) {
        setLibValues();
        windowResized();
    };

    function updateMouseMove(evt) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouseX = evt.clientX - rect.left - root.scrollLeft;
        mouseY = evt.clientY - rect.top - root.scrollTop;
    }
    function updateTouchMove(evt) {
        let rect = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouseX = evt.touches[0].clientX - rect.left - root.scrollLeft;
        mouseY = evt.touches[0].clientY - rect.top - root.scrollTop;
    }
}

// VECTOR

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vector(this.x, this.y);
    }
}

function vec(x = 0, y = 0) {
    return new Vector(x, y);
}