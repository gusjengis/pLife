//Model Container

class Model{
    constructor(vertices, SmoothLighting, GLPrimitive){
        this.vertices = vertices;
        this.SmoothLighting = SmoothLighting;
        this.GLPrimitive = GLPrimitive;
    }
}

//Asset Generation

function generateSphere(delRads){
    let model = [];
    for(i=-Math.PI/2; i<Math.PI/2; i+=delRads){
        let ringRadius = Math.cos(i);
        let ringRadius2 = Math.cos(i+delRads);
        let Y = Math.sin(i);
        let Y2 = Math.sin(i+delRads);
        for(j=0; j<(Math.PI*2); j+=delRads){
            let X = Math.cos(j);
            let X2 = Math.cos(j+delRads);
            let Z = Math.sin(j);
            let Z2 = Math.sin(j+delRads);
            model.push(ringRadius*X2); model.push(Y); model.push(ringRadius*Z2);
            // model.push(ringRadius*X); model.push(Y); model.push(ringRadius*Z);
            model.push(ringRadius2*X); model.push(Y2); model.push(ringRadius2*Z);
            
            // model.push(ringRadsius2*X); model.push(Y2); model.push(ringRadius2*Z);
            model.push(ringRadius2*X2); model.push(Y2); model.push(ringRadius2*Z2);
            model.push(ringRadius*X2); model.push(Y); model.push(ringRadius*Z2);

        }
    }
    return model;
}

//Asset Instances

let sphereModel = new Model(generateSphere(0.1), true, gl.TRIANGLE_STRIP);
let cubeModel = new Model([
    1,1,1,
    1,-1,1,
    -1,1,1,

    -1,1,1,
    -1,-1,1,
    1,-1,1,

    -1,-1,1,
    -1,-1,-1,
    -1,1,1,

    -1,-1,-1,
    -1,1,-1,
    -1,1,1,

    -1,-1,-1,
    1,-1,-1,
    1,1,-1,

    -1,-1,-1,
    -1,1,-1,
    1,1,-1,

    1,-1,-1,
    1,-1,1,
    1,1,1,

    1,1,1,
    1,1,-1,
    1,-1,-1,

    1,1,1,
    -1,1,1,
    -1,1,-1,

    1,1,1,
    1,1,-1,
    -1,1,-1,

    -1,-1,-1,

    1,-1,1,
    1,-1,-1,

    1,-1,1,
    -1,-1,-1,
    -1,-1,1,
], false, gl.TRIANGLES);

