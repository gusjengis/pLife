document.body.style.zoom= 1/window.devicePixelRatio;
document.addEventListener('contextmenu', event => event.preventDefault());
if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
}

function canvasOnLoad(){
    canvasResize();
    clear();
    POINTS = new Points(createPoints(numPoints, Settings.numColors));
    InitializeShaders();
    drawFrame();
    Settings.rMax = canvas.width/20;
    initMenu();
    toggleMenu();
}
let frametimes = [];
let rendering = false;
function canvasResize(){
    document.body.style.zoom=1/window.devicePixelRatio;
    canvas.width = window.devicePixelRatio*document.documentElement.clientWidth;
    canvas.height = window.devicePixelRatio*document.documentElement.clientHeight;
    gl.viewport(0,0,canvas.width,canvas.height);
    aspect = canvas.width/canvas.height;
    perspective = m4.perspective(fov, aspect, zNear, zFar);
    clear();
}
let tick = 0;
let speed = 12;
let amplitude = 1000;
let lastTimestamp = Date.now();
let resetTimestamp = Date.now();
function drawFrame(timestamp){
    
    let start = window.performance.now();
    if(isNaN(timestamp - lastTimestamp)){
        timestamp = Date.now();
    }
    let cW = canvas.width;
    let cH = canvas.height;
    if (CLEAR) clear();
    
    //if(rendering){
    //    OLDcalcForces();

    // } else {
        calcForces();
    // }
    //console.log(timestamp-lastTimestamp)
    applyVelocities((timestamp-lastTimestamp)*Settings.speed);
    //if(rendering) drawPoints(POINTS, Settings.particleSize);//*Math.sqrt(Settings.rMax));
    drawPoints(POINTS, Settings.particleSize);
    if(Settings.colors.length>0){
        // drawPoint(mouseX, mouseY, Settings.colors[mI][0], Settings.colors[mI][1], Settings.colors[mI][2], 10);
    }






    if(Date.now() - resetTimestamp > 30000){
        resetTimestamp = Date.now();
        // reset();
    }
    lastTimestamp = timestamp;
    frametimes.push((window.performance.now() - start));
    if(frametimes.length == 500){
        let sum = 0;
        for(i=0; i<frametimes.length; i++){
            sum+=frametimes[i];
        }
        
        frametimes = [];
        console.log("Avg FPS(New Calcs, "+colsandrows+" zones, "+numPoints+" points): "+1000/(sum/500)+", Avg Framtime: "+sum/500);
        // if(!rendering) {
        //     //scramblePoints();
        //     console.log("Avg FPS(New Calcs, "+colsandrows+" zones): "+1000/(sum/500)+", Avg Framtime: "+sum/500);
        //     //rendering = true;
        //     //debug = false;

        //     //colsandrows++;
        // } else {
        //     //scramblePoints();
        //     console.log("Avg FPS(Old Calcs): "+1000/(sum/500)+", Avg Framtime: "+sum/500);
        //     //rendering = false;
        //     //debug = true;
        // }
    }
    //console.log(window.performance.now()-start);
    window.requestAnimationFrame(drawFrame);
}

// function drawPoints(){
//     // console.log(POINTS.xPos[0]+", "+POINTS.yPos[0])
//     drawPoint(POINTS.xPos[0], POINTS.yPos[0], POINTS.colors[i*3],
//         POINTS.colors[i*3+1], 
//         POINTS.colors[i*3+2])
//     if(POINTS.length()>0){
//         let i;
//         for(i=0; i<POINTS.length(); i++){

//             drawPoint(
//                 POINTS.xPos[i],
//                 POINTS.yPos[i],
//                 POINTS.colors[i*3],
//                 POINTS.colors[i*3+1], 
//                 POINTS.colors[i*3+2], 3.5);
//         }
//     }
// }


function clear(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

