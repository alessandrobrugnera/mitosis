let peer = new peerjs.Peer({secure: true, debug: 3});
const urlParams = new URLSearchParams(window.location.search);
let conn = undefined;

peer.on('error', (err) => {
    peer.destroy();
    if (urlParams.get("refresh") !== null) {
        location.reload();
    }
});


let cells = [];
let maxSimulationFrameRate = 120;
let tools = [new NoTool(), new NewCellTool(), new DeathTool(), new Thanos(), new Spreader(), new Magnet(), new GrabberTool(), new Freezer(), new Exploder()]
let selectedTool = 0
let foods = [];


let sexReproduction = true;
let asexReproduction = true;
let simFr = 0;
let cellsCap = 250;
let brainActive = false;
let canDie = true;
let maxFood = 8;
let growWithFood = false;

function setup() {
    canv = createCanvas(innerWidth - 4, innerHeight - 4);
    //setTimeout(() => , 2000);
    if (typeof urlParams.get("connectId") !== 'string') {
        for (let i = 0; i < 100; i++) {
            cells.push(new Cell());
        }
        runSimulation();
        peer.on('connection', (conn) => {
                console.log("New peer connected!");
            }
        );
        setInterval(() => {
            if (!peer) {
                return;
            }
            let tmpConnections = peer.connections;
            for (let connection in tmpConnections) {
                if (tmpConnections[connection] && tmpConnections[connection][0]) {
                    tmpConnections[connection][0].send({
                        cells: Cell.serializeArray(cells),
                        foods: Food.serializeArray(foods),
                        selectedTool: selectedTool
                    });
                }
            }
        }, 200);
    } else {
        let hostPeerId = urlParams.get("connectId");
        peer.on('open', () => {
            conn = peer.connect(hostPeerId, {serialization: "json"});
            conn.on('data', async (dt) => {
                if (dt && dt.cells && dt.foods && typeof dt.selectedTool !== 'undefined') {
                    Cell.updateArray(dt.cells, cells);
                    Food.updateArray(dt.foods, foods);
                    selectedTool = dt.selectedTool;
                } else {
                    console.warn(dt);
                }
            });
        });
    }
}

function draw() {
    background(0);
    for (let i = 0; i < cells.length; i++) {
        cells[i].show();
    }
    for (let i = 0; i < foods.length; i++) {
        foods[i].show();
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
    fill(255);
    noStroke();
    textSize(15);
    let peerShow = "Your ID: " + (peer.open ? peer.id : (peer.destroyed ? "Server error: refresh the page" : "Disconnected"));
    text(peerShow, width - textWidth(peerShow), height);

}

function runSimulation() {
    let execStartAt = millis();
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].timeToDie() && canDie) {
            cells.splice(i, 1);
        } else {
            if (!growWithFood) {
                cells[i].grow();
            }
            if (cells[i].timeToReproduce()) {
                if (sexReproduction) {
                    for (let j = i + 1; j < cells.length; j++) {
                        if (cells[j].timeToReproduce() && cells[i].pos.dist(cells[j].pos) <= cells[i].r + cells[j].r) {
                            if (brainActive) {
                                cells.push(cells[i].combine(cells[j]).mutate());
                                cells.push(cells[i].combine(cells[j]).mutate());
                            } else {
                                cells.push(cells[i].combine(cells[j]));
                                cells.push(cells[i].combine(cells[j]));
                            }
                            cells.splice(i, 1);
                            cells.splice(j - 1, 1);
                        }
                    }
                }
                if (asexReproduction) {
                    if (brainActive) {
                        cells.push(cells[i].generateChild().mutate());
                        cells.push(cells[i].generateChild().mutate());
                    } else {
                        cells.push(cells[i].generateChild());
                        cells.push(cells[i].generateChild());
                    }
                    cells.splice(i, 1);
                }
            }
            if (brainActive) {
                cells[i].think(foods);
            }
            cells[i].move();
        }
    }

    // Food processing
    for (let i = 0; i < foods.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].pos.dist(foods[i].pos) < cells[j].r) {
                cells[j].eat(foods[i].poisoned);
                foods.splice(i, 1);
                i--;
                break; // No need to check other cells...
            }
        }
    }
    for (let i = foods.length; i < maxFood; i++) {
        foods[i] = new Food();
    }

    let executionTime = millis() - execStartAt;
    if (1000 / maxSimulationFrameRate - executionTime <= 0) {
        console.log("Simulation speed too low! Can't keep up!");
    }
    simFr = (1000 / max(1000 / maxSimulationFrameRate, executionTime));
    while (cells.length > cellsCap) {
        cells.splice(cellsCap, 1);
    }
    setTimeout(runSimulation, max(1, 1000 / maxSimulationFrameRate - executionTime))
}

function mouseWheel(event) {
    mouseReleased();
    if (event.delta < 0) {
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

function windowResized() {
    resizeCanvas(innerWidth - 4, innerHeight - 4);
}

function randomizeColors() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].color = color(random(255), random(255), random(255), 100);
    }
}

function nextGeneration() {
    let savedCells = [];
    for (let i = 0; i < cells.length; i++) {
        savedCells[i] = cells[i];
    }
    console.log('Spwaning next generation');
    calculateFitness(savedCells);
    let total = cells.length;
    for (let i = 0; i < total; i++) {
        cells[i] = pickOne(savedCells);
    }
    savedCells = [];
}

function pickOne(cells) {
    let index = 0;
    let r = random(1);
    while (r > 0) {
        r = r - cells[index].fitness;
        index++;
    }
    index--;
    let cell = cells[index];
    let child = new Cell(cell.pos.x, cell.pos.y, cell.r, cell.color, cell.generation, cell.brain);
    child.mutate();
    return child;
}

function calculateFitness(cells) {
    let sum = 0;
    let maxScore = 0;
    for (let cell of cells) {
        sum += cell.score;
        if (cell.score > maxScore) {
            maxScore = cell.score;
        }
    }
    console.log("Max score: " + maxScore);
    for (let cell of cells) {
        if (cell) {
            cell.fitness = cell.score / sum;
        } else {
            console.log("undef cell");
        }
    }
}

function activateBrain() {
    canDie = false;
    sexReproduction = false;
    growWithFood = true;
    brainActive = true;
    cellsCap = 100;
    setInterval(() => {
        nextGeneration()
    }, 30000);
}