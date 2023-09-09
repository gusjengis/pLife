window.onload = function() {
    canvasOnLoad();
}
window.onresize = function(){
    canvasResize();
}

let mouseX;
let mouseY;
let mX;
let mY;
let leftClick = false;
let xRot = -Math.PI/10;
let yRot = Math.PI/4;
let zRot = 0;

document.onmousemove = function(e){
    mouseX = e.clientX*window.devicePixelRatio;
    mouseY = e.clientY*window.devicePixelRatio;
    mX = canvas.width/2 + mouseX/6;
    mY = canvas.height/2 + mouseY/6;
    xRot+=-e.movementY/1000;
    yRot+=-e.movementX/1000;
    zRot+=-e.movementY/1000;
    if(xRot > Math.PI/2-0.001){
        xRot = Math.PI/2-0.001;
    }

    if(xRot < -Math.PI/2+0.001){
        xRot = -Math.PI/2+0.001;
    }
    
    

    // console.log(camera.rot)
}

let speedDiv = 2.5;
document.onmousewheel = function(e){
    let radius = document.getElementById("Radius");
    if(e.deltaY > 0){
        radius.value = radius.step*Math.round((radius.value*1.1)/radius.step);

    } else if(e.deltaY < 0) {
        radius.value = radius.step*Math.round((radius.value*(1/1.1))/radius.step);

    } else {
        radius.value = 100;
    }
    radius.onchange();
}

let mI = 0;
document.onmousedown = function(e){
    // canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    // canvas.requestPointerLock()
    leftClick = true;
    if(e.button == 2) {
        mI++;
        if(mI>Settings.colors.length-1){
            mI=0;
        }
    } else if(e.button == 0) {
        // POINTS.add(new Point([mouseX, mouseY], Settings.colors[mI]));
    }

}

document.onmouseup = function(e){
    leftClick = false;
}

let keyW = 0;
let keyA = 0;
let keyS = 0;
let keyD = 0;
let Space = 0;
let KeyC = 0;
let CRT = false;
let Shift = false;

let CLEAR = true;

document.onkeydown = function(e){
    if(e.code == 'KeyW') {keyW = 1}
    if(e.code == 'KeyA') {keyA = 1}
    if(e.code == 'KeyS') {keyS = 1}
    if(e.code == 'KeyD') {keyD = 1}
    if(e.code == 'Space') {Space = 1}
    if(e.code == 'KeyC') {CLEAR = !CLEAR}
    if(e.code == 'KeyR') {scramblePoints()}
    if(e.code == 'KeyN') {reset()}
    if(e.code == 'KeyP' && !CRT) {CRT = true}
    else if(e.code == 'KeyP' && CRT) {CRT = false}
    if(e.code == 'ShiftLeft') {Shift = true}
    if(e.code == 'KeyM') {toggleMenu()}

}

document.onkeyup = function(e){
    if(e.code == 'KeyW') {keyW = 0};
    if(e.code == 'KeyA') {keyA = 0};
    if(e.code == 'KeyS') {keyS = 0};
    if(e.code == 'KeyD') {keyD = 0};
    if(e.code == 'Space') {Space = 0};
    if(e.code == 'KeyC') {KeyC = 0};
    if(e.code == 'ShiftLeft') {Shift = false}
}

function applyKeystrokes(delTime){
    let speed;
    if(Shift){
        speed = 0.003*delTime;
    } else {
        speed = 0.001*delTime;
    }
    // console.log(keyW +","+ keyA +","+ keyS +","+ keyD);
    let lrDir = v3.crossProduct(camera.dir, [0,1,0]);

    if(keyW==1) {
        camera.moveZ(speed*camera.dir[2]);
        camera.moveX(speed*camera.dir[0]);
        // camera.moveY(speed*camera.dir[1]);
    }
    if(keyS==1) {
        camera.moveZ(-speed*camera.dir[2]);
        camera.moveX(-speed*camera.dir[0]);
        // camera.moveY(speed*camera.dir[1]);
    }
    if(keyA==1){
        camera.moveZ(-speed*lrDir[2]);
        camera.moveX(-speed*lrDir[0]);
        // camera.moveY(speed*camera.dir[1]);
    }
    if(keyD==1){
        camera.moveZ(speed*lrDir[2]);
        camera.moveX(speed*lrDir[0]);
        // camera.moveY(speed*camera.dir[1]);
        
    }
    camera.moveY(Space*speed);
    camera.moveY(-KeyC*speed);
}

function test(code){
    let start = Date.now();
    eval(code);
    console.log(1000/(Date.now() - start));
}

