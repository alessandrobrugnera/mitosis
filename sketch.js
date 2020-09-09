let cells = [];
let maxSimulationFrameRate = 120;
let tools = [new NoTool(), new NewCellTool(), new DeathTool(), new Thanos(), new Spreader(), new Magnet(), new GrabberTool()]
let selectedTool = 0
let sexReproduction = true;
let asexReproduction = true;

let simFr = 0;
let cellsCap = 1000;

function setup() {
  createCanvas(innerWidth - 5, innerHeight - 5);
  for(let i = 0; i < 100; i++){
    cells.push(new Cell());
  }
  runSimulation();
}

function draw() {
  background(0);
  for(let i = 0; i < cells.length; i++){
      cells[i].show();
  }
  tools[selectedTool].show(createVector(5, 80));
  textSize(15);
  fill(255, 0, 0, 150);
  stroke(0, 0, 255, 150);
  text("Use your mouse wheel to select the tool.\nThen click (or keep pressed) to use it.", 5, 30);
  fill(255);
  stroke(0, 255, 0);
  textSize(15);
  let frtxt = "Render fr " + Math.round(frameRate()) + " Simulation fr " + Math.round(simFr) + "\nLiving cells: " + cells.length;
  text(frtxt, width / 2 - textWidth(frtxt) / 2, 20);
  fill(255);
  stroke(0, 255, 0);
  textSize(15);
  let reprtxt = "Sex: " + (sexReproduction ? "ON" : "OFF") + "\nASex: " + (asexReproduction ? "ON" : "OFF");
  text(reprtxt, width - textWidth(reprtxt), 20);

}

function runSimulation() {
    let execStartAt = millis();
    for(let i = 0; i < cells.length; i++){
        if(cells[i].timeToDie()){
            cells.splice(i, 1);
        }else{
            cells[i].grow();
            if(cells[i].timeToReproduce()) {
                if (sexReproduction) {
                    for (let j = i + 1; j < cells.length; j++) {
                        if (cells[j].timeToReproduce() && cells[i].pos.dist(cells[j].pos) <= cells[i].r + cells[j].r) {
                            cells.push(cells[i].combine(cells[j]));
                            cells.push(cells[i].combine(cells[j]));
                            cells.splice(i, 1);
                            cells.splice(j - 1, 1);
                        }
                    }
                }
                if (asexReproduction) {
                    cells.push(cells[i].generateChild());
                    cells.push(cells[i].generateChild());
                    cells.splice(i, 1);
                }
            }
            cells[i].move();
        }
    }
    let executionTime = millis() - execStartAt;
    if (1000 / maxSimulationFrameRate - executionTime <= 0) {
        console.log("Simulation speed too low! Can't keep up!");
    }
    simFr =  (1000 / max(1000 / maxSimulationFrameRate, executionTime));
    while(cells.length > cellsCap) {
        cells.splice(cellsCap, 1);
    }
    setTimeout(runSimulation, max(1, 1000 / maxSimulationFrameRate - executionTime))
}

function mouseWheel(event) {
    mouseReleased();
    if(event.delta < 0) {
        selectedTool = max(0, selectedTool - 1);
    } else if (event.delta > 0) {
        selectedTool = min(tools.length - 1, selectedTool + 1);
    }
}

function mouseClicked() {
    if (typeof tools[selectedTool].onClick === 'function') {
        tools[selectedTool].onClick(createVector(mouseX, mouseY));
    }
}

function mousePressed() {
    if (typeof tools[selectedTool].onPress === 'function') {
        tools[selectedTool].onPress();
    }
}

function mouseReleased() {
    if (typeof tools[selectedTool].onRelease === 'function') {
        tools[selectedTool].onRelease();
    }
}

