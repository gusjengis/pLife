function toggleMenu(){
    let menu = document.getElementById("menu");
    if(menu.style.visibility == "" || menu.style.visibility == "visible"){
        menu.style.visibility = "hidden";
    } else {
        menu.style.visibility = "visible";
    }
}

function initMenu(){
    let menu = document.getElementById("menu");
    menu.innerHTML = "";
    let forces = document.createElement("div");
    forces.className = "forcesDiv";
    menu.appendChild(forces);
    let sliders = document.createElement("div");
    sliders.className = "sliderDiv";
    menu.appendChild(sliders);
    let buttons = document.createElement("div");
    buttons.className = "buttonDiv";
    menu.appendChild(buttons);
    createForceGrid(forces);
    createSliders(sliders);
    createButtons(buttons);
}

function createSliders(parent){
    createSlider("\u0394T Divisor", 1/100, 5, "speed", false, parent);
    createSlider("Radius", 1, canvas.width/6, "rMax", false, parent);
    createSlider("Friction", 0, 1, "friction", false, parent);
    createSlider("Max Colors", 1, 20, "maxColors", true, parent);
    createSlider("Min Colors", 1, 20, "minColors", true, parent);
    createSlider("rMin", 0, 1, "rMin", false, parent);
    createSlider("Particle Size", 1, 100, "particleSize", false, parent);

}

function createSlider(displayName, low, high, settingsName, forceInt, parent){
    //create div
    let div = document.createElement("div");
    div.className = "sliderDiv";
    //create title
    let title = document.createElement("h4");
    title.id = displayName + "Header";
    title.className = "sliderHeader";
    //create slider input
    let slider = document.createElement("input");
    slider.type = "range";
    slider.className = "slider";
    slider.id = displayName;
    slider.min = low;
    slider.max = high;
    slider.step = (high - low)/1000;
    if(forceInt){
        slider.step = 1;
    }
    //set value
    slider.title = title.innerHTML;
    slider.value = eval("Settings."+settingsName);
    title.innerHTML=displayName+": "+slider.value;

    //create on change
    slider.onchange = function(){
        eval("Settings."+settingsName+" = "+this.value);
        document.getElementById(this.id+"Header").innerHTML = displayName+": "+slider.value;
    }
    
    div.appendChild(title);
    div.appendChild(slider);
    parent.appendChild(div);
}

function createButtons(parent){
    createButton("Reset Settings", "resetSettings", parent);
    createButton("Clear Attractions", "clearAttractions", parent);
    createButton("Toggle Clearing", "toggleClear", parent);
    createButton("Scramble Particles", "scramblePoints", parent);
    createButton("Randomize", "reset", parent);


}
function createButton(label, foo, parent){
    let button = document.createElement("input");
    button.value = label;
    button.className = "menuButton";
    button.onclick = function(){
        eval(foo+"()");
    }
    parent.appendChild(button);
}

function resetSettings(){
    let forces = Settings.forces;
    let colors = Settings.colors;
    Settings = new settings();
    Settings.forces = forces;
    Settings.colors = colors;
    Settings.rMax = canvas.width/20;

    initMenu();
}

function clearAttractions(){
    let dim = Settings.forces[0].length;
    let col = [];
    for(i=0; i<dim; i++){
        col.push(1);
    }
    Settings.forces = [];
    for(i=0; i<dim; i++){
        Settings.forces.push(col);
    }
    console.log(Settings.forces)
    initMenu();
}

function toggleClear(){
    CLEAR = !CLEAR;
}

function scramblePoints(){
    let num = POINTS.xPos.length;
    let points = [];
    for(i=0; i<num/numColors; i++){
        for(j=0; j<numColors; j++){
            points.push(new Point( [canvas.width*Math.random(), canvas.height*Math.random()], 
                                   Settings.colors[j]
            ));
        }
    }
    POINTS = new Points(createPoints(numPoints, Settings.numColors));
}

function createForceGrid(parent, colors){
    let rowOne = document.createElement("div")
    let boxOne = document.createElement("INPUT")
    boxOne.setAttribute('type', 'text');
    boxOne.setAttribute('class', 'forceInput cornerColorLabel');
    boxOne.style.backgroundColor = 'rgba(0,0,0,0)';
    rowOne.appendChild(boxOne);
    for(i=0; i<Settings.numColors; i++){
        let box = document.createElement("INPUT")
        box.setAttribute('type', 'text');
        box.setAttribute('class', 'forceInput colorLabel');
        box.style.backgroundColor = 'rgba('+Settings.colors[i][0]+','+Settings.colors[i][1]+','+Settings.colors[i][2]+',1)';
        rowOne.appendChild(box);
    }
    parent.appendChild(rowOne);

    for(i=0; i<Settings.numColors; i++){
        let row = document.createElement("div")
        for(j=0; j<Settings.numColors+1; j++){
            let box = document.createElement("INPUT")
            box.setAttribute('type', 'text');
            if(j>0) {
                box.setAttribute('class', 'forceInput');
                box.value = Settings.forces[i][j-1];
                box.style.backgroundColor = colorFromVal(Settings.forces[i][j-1]);
                box.i = i;
                box.j = j-1;
                box.onchange = function() {
                    Settings.forces[this.i][this.j] = Number(this.value);
                    this.style.backgroundColor = colorFromVal(Number(this.value));
                }
            } else {
                box.setAttribute('class', 'forceInput colorLabel');
                box.style.backgroundColor = 'rgba('+Settings.colors[i][0]+','+Settings.colors[i][1]+','+Settings.colors[i][2]+',1)';        
            }
            row.appendChild(box)
        }
        parent.appendChild(row)
    }
}

function refreshForceGrid(){
    let menu = document.getElementById("menu");
    menu.innerHTML = "";
    createForceGrid(menu);
}

function colorFromVal(val){
    if(val > 0){
        return 'rgba(0,'+255*val+', 0, 1)'
    } else if(val < 0){
        return 'rgba('+255*Math.abs(val)+', 0, 0, 1)'
    } else {
        return 'rgba(0,0,0,0)'
    }
}