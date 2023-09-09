class Point{
    constructor(pos, color){
        this.pos = pos;
        this.color = color;
        // this.vel = [0.04*Math.random()-0.02,0.04*Math.random()-0.02];
        this.vel = [0,0];
    }

    push(vec){
        this.vel[0] = (this.vel[0] + vec[0]);
        this.vel[1] = (this.vel[1] + vec[1]);

    }

    applyFriction(tDel){
        this.vel[0] *= Settings.friction**tDel;
        this.vel[1] *= Settings.friction**tDel;
    }

    applyVel(tDel){
        this.pos[0] += tDel*this.vel[0];
        this.pos[1] += tDel*this.vel[1];

            if(this.pos[0] > canvas.width) {
                this.pos[0] = canvas.width;
                this.vel[0] = this.vel[0]*-1;

            }
            if(this.pos[0] < 0){
                this.pos[0] = 0;
                this.vel[0] = this.vel[0]*-1;

            }
            if(this.pos[1] > canvas.height) {
                this.pos[1] = canvas.height;
                this.vel[1] = this.vel[1]*-1;
            }
            if(this.pos[1] < 0) {
                this.pos[1] = 0;
                this.vel[1] = this.vel[1]*-1;
            }
    }
}
let colsandrows = 7;
class Points {
    constructor(pointArr){
        this.xPos = [];
        this.yPos = [];
        this.colors = [];
        this.vel = [];
        this.prevSections = [];
        let i,j;
        this.sections = Array.from(Array(colsandrows), () => new Array(colsandrows));
        for(i=0; i<colsandrows; i++){
            for(j=0; j<colsandrows; j++){
                this.sections[i][j] = [];
            }
        }
        for(i=0; i<pointArr.length; i++){
            this.xPos.push(pointArr[i].pos[0]);
            this.yPos.push(pointArr[i].pos[1]);
            this.colors.push(pointArr[i].color[0]);
            this.colors.push(pointArr[i].color[1]);
            this.colors.push(pointArr[i].color[2]);
            this.vel.push(pointArr[i].vel);
            let x = Math.floor(pointArr[i].pos[0]/(colsandrows));
            let y = Math.floor(pointArr[i].pos[1]/(colsandrows));
            if(x >= colsandrows) x = colsandrows-1;
            if(y >= colsandrows) y = colsandrows-1;
            this.sections[x][y].push(i);
            this.prevSections.push(x + colsandrows*Math.floor(pointArr[i].pos[1]/(colsandrows)));
            //console.log(this.prevSections[i])
        }
        //console.log(this.sections)
    }

    Data() {
        let data = [];
        let i;
        for(i=0; i<this.length(); i++){
            data.push(this.xPos[i]);
            data.push(this.yPos[i]);
            data.push(this.vel[i][0]);
            data.push(this.vel[i][1]);
        }
        return new Float32Array(data);
    }

    length(){
        return this.vel.length;
    }

    getColor(i){
        return [this.colors[i*3], this.colors[i*3+1], this.colors[i*3+2]]
    }

    add(point){
        this.xPos.push(point.pos[0]);
        this.yPos.push(point.pos[1]);
        this.colors.push(point.color[0]);
        this.colors.push(point.color[1]);
        this.colors.push(point.color[2]);
        this.vel.push(point.vel);
    }

    push(i, vec){
        // console.log(this.vel[i][0] + vec[0])

        this.vel[i][0] = this.vel[i][0] + vec[0];
        this.vel[i][1] = this.vel[i][1] + vec[1];


    }

    applyFriction(tDel){
        let i;
        // console.log(tDel)
        for(i=0; i<this.vel.length; i++){
            this.vel[i][0] = this.vel[i][0]*Settings.friction**tDel;
            this.vel[i][1] = this.vel[i][1]*Settings.friction**tDel;
        }
        
    }

    applyVel(i, tDel){
        this.xPos[i] += tDel*this.vel[i][0];
        this.yPos[i] += tDel*this.vel[i][1];

            if(this.xPos[i] > canvas.width) {
                this.xPos[i] = canvas.width;
                this.vel[i][0] = this.vel[i][0]*-1;

            }
            if(this.xPos[i] < 0){
                this.xPos[i] = 0;
                this.vel[i][0] = this.vel[i][0]*-1;

            }
            if(this.yPos[i] > canvas.height) {
                this.yPos[i] = canvas.height;
                this.vel[i][1] = this.vel[i][1]*-1;
            }
            if(this.yPos[i] < 0) {
                this.yPos[i] = 0;
                this.vel[i][1] = this.vel[i][1]*-1;
            }
    }
}
let numPoints = 600;
let numColors = 6;


function createPoints(num, numColors){
    let i,j;
    let points = [];
    for(i=0; i<num/numColors; i++){
        for(j=0; j<numColors; j++){
            points.push(new Point( [canvas.width*Math.random(), canvas.height*Math.random()], 
                                   Settings.colors[j]
            ));
        }
    }
    
    setupAttractions(Settings.numColors);
    return points;
}

var POINTS = new Points(createPoints(numPoints, Settings.numColors));

// var attractions = [];
// var attractionLimits = [];



function applyVelocities(tDel){
    if(POINTS.length() > 0 && Math.abs(tDel) < 100000){
        POINTS.applyFriction(tDel);
        let sW = canvas.width/colsandrows;
        let sH = canvas.height/colsandrows;
        for(i=0; i<POINTS.length(); i++){
            POINTS.applyVel(i, tDel);
            // console.log(POINTS);
            
            // let a = POINTS.prevSections[i] % colsandrows;
            // let b = Math.floor(POINTS.prevSections[i]/colsandrows);
            // let px = POINTS.xPos[i];
            // let py = POINTS.yPos[i];
            // if(sW*a<px && px<sW*(a+1) && sH*b<py && py<sH*(b+1)){
            //     continue;
            // } else {
            //     let index = POINTS.sections[a][b].indexOf(i);
            //     POINTS.sections[a][b][index] = null;
            //     let x = Math.floor(px/(sW));
            //     let y = Math.floor(py/(sH));
            //     if(x >= colsandrows) x = colsandrows-1;
            //     if(y >= colsandrows) y = colsandrows-1;
            //     // POINTS.sections[x][y].push(i);
            //     for(l=0; l<POINTS.sections[x][y].length; l++){
            //         if(POINTS.sections[x][y][l] == null){
            //             POINTS.sections[x][y][l] = i;
            //             break;
            //         }
            //         if(l == POINTS.sections[x][y].length-1){
            //             POINTS.sections[x][y].length*=2;
            //             for(p=POINTS.sections[x][y].length/2; p<POINTS.sections[x][y].length; p++){
            //                 POINTS.sections[x][y][p] = null;
            //             }
            //             console.log(POINTS.sections[x][y])
            //         }
            //     }
            //     //POINTS.sections[x][y][POINTS.sections[x][y].length] = i;

            // }
        }
    } 
}



function magnitude(vec){
    return Math.sqrt( (vec[0])**2 + (vec[1])**2);
}

function Unit(vec){
    let mag = Math.sqrt( (vec[0])**2 + (vec[1])**2);
    return [vec[0]/mag, vec[1]/mag];
}

function calcForce(vec, attraction){
    let dist = magnitude(vec);
    if(dist>1){
        return 0;
    }
    let mult = 0;
    if(dist < Settings.rMin){
       mult = (dist / Settings.rMin - 1) ;
    }    
    else if(dist > Settings.rMin && dist < 1 ){
    mult = attraction * (1 - Math.abs(1 + Settings.rMin - 2 * dist) / (1 - Settings.rMin));
    }
    if(dist <= 0){
        return 0;
    } else {
        return mult/dist;
    }
    
}

function getIndexFromColor(color){
    for(i=0; i<Settings.colors.length; i++){
        if(color[0] == Settings.colors[i][0] &&
           color[1] == Settings.colors[i][1] &&
           color[2] == Settings.colors[i][2]) {

            return i;
        }
    }
    return -1;
}
let debug = false;
function calcForces(){
    let i,j;
    POINTS.sections = Array.from(Array(colsandrows), () => new Array(colsandrows));
    for(i=0; i<colsandrows; i++){
        for(j=0; j<colsandrows; j++){
            POINTS.sections[i][j] = [];
        }
    }
    for(i=0; i<POINTS.length(); i++){
        let x = Math.floor(POINTS.xPos[i]/(canvas.width/colsandrows));
        let y = Math.floor(POINTS.yPos[i]/(canvas.height/colsandrows));
        if(x >= colsandrows) x = colsandrows-1;
        if(y >= colsandrows) y = colsandrows-1;
        POINTS.sections[x][y].push(i);
    }
    for(h=0; h<POINTS.length(); h++){
        let fx = 0;
        let fy = 0;
        let x = POINTS.xPos[h];
        let y = POINTS.yPos[h];
        let sW = canvas.width/colsandrows;
        let sH = canvas.height/colsandrows;
        for(i=0; i<colsandrows; i++){
            for(j=0; j<colsandrows; j++){
                let sX = sW*i+sW/2 + sW/2*(x-(sW*i+sW/2))/Math.abs((x-(sW*i+sW/2)));
                let sY = sH*j+sH/2 + sH/2*(y-(sH*j+sH/2))/Math.abs((y-(sH*j+sH/2)));
                if(h==0 && debug) drawRect(sW*i+1, sH*(colsandrows - (j+1))+1, sW-2, sH-2, 50, 0, 0);
                if(sW*i<x && x<sW*(i+1) || sH*j<y && y<sH*(j+1)){
                    if(h==0 && debug) drawRect(sW*i+1, sH*(colsandrows - (j+1))+1, sW-2, sH-2, 50, 0, 50);
                    let vX = sW*i+sW/2 - x;
                    let vY = sH*j+sH/2 - y;
                    let distance = dist(x,y,vX+x,vY+y);
                    vX /= distance;
                    vY /= distance;
                    vX = Math.round(vX);
                    vY = Math.round(vY);
                    if(vX == 0){
                        sX = x;
                    } else if(vY == 0){
                        sY = y;
                    }
                }
                if(dist(x,y,sX,sY) < Settings.rMax || POINTS.sections[i][j].includes(h)){
                    if(h==0 && debug){
                        drawRect(sW*i+1, sH*(colsandrows - (j+1))+1, sW-2, sH-2, 0, 50, 0);
                        drawPoint(sX,sY,10,255,255,255);
                    }
                    
                    for(k=0; k<POINTS.sections[i][j].length; k++){
                        if(POINTS.sections[i][j][k] == null){
                            continue;
                        }
                        let vec = [(POINTS.xPos[POINTS.sections[i][j][k]] - POINTS.xPos[h])/Settings.rMax, (POINTS.yPos[POINTS.sections[i][j][k]] - POINTS.yPos[h])/Settings.rMax];
                        
                        let force = calcForce(vec, Settings.forces[getIndexFromColor(POINTS.getColor(POINTS.sections[i][j][k]))][getIndexFromColor(POINTS.getColor(h))]);
                        // fx -= force[0];
                        // fy -= force[1];
                        POINTS.push(h, [vec[0]*force, vec[1]*force]);
                    }
                } else {
                    if(h==0 && debug) {
                        
                        drawPoint(sX,sY,10,255,0,0);
                    }
                }
                if(h==0 && debug) drawPoint(x,y,2*Settings.rMax,255,0,0);          
            }
        }
    }
}

function OLDcalcForces(){
    let i,j;
    for(i=0; i<POINTS.length(); i++){
        let fx = 0;
        let fy = 0;
        for(j=0; j<POINTS.length(); j++){
            let vec = [(POINTS.xPos[j] - POINTS.xPos[i])/Settings.rMax, (POINTS.yPos[j] - POINTS.yPos[i])/Settings.rMax];
            
            let force = calcForce(vec, Settings.forces[getIndexFromColor(POINTS.getColor(j))][getIndexFromColor(POINTS.getColor(i))]);
            // fx -= force[0];
            // fy -= force[1];
            
            POINTS.push(i, [vec[0]*force, vec[1]*force]);
        }
        
    }
}

function reset(){
    // Settings = new settings();
    Settings.numColors = Math.round(Math.random()*(Settings.maxColors - Settings.minColors)) + Settings.minColors;
    Settings.colors = setupColors(Settings.numColors);
    POINTS = new Points(createPoints(numPoints, Settings.numColors));
    newAttractions();
}

function dist(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}