class Cell {
    constructor(x, y, r, c, g, brain, score) {
        this.pos = createVector(x ?? random(50, width - 50), y ?? random(50, height - 50));
        this.r = r ?? random(10, 20);
        this.color = c ?? color(255 - random(0, 225), 255 - random(0, 225), 255 - random(0, 225), 100);
        this.speed = createVector(random(-1, 1), random(-1, 1));
        this.growthFactor = random(0.05, 0.07);
        this.dieProb = Math.random() * .005;
        this.generation = g ?? 0;

        this.brain = undefined;
        this.score = score ?? 0;
        this.fitness = 0;

        if (typeof brain === 'NeuralNetwork') {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(2, 8, 2);
        }
    }

    timeToDie() {
        return this.dieProb > Math.random();
    }

    grow() {
        this.r += this.growthFactor;
    }

    timeToReproduce() {
        return this.r > 50;
    }

    generateChild() {
        return new Cell(
            this.pos.x - random(20, 40),
            this.pos.y - random(20, 40),
            this.r / Math.sqrt(2),
            this.color,
            this.generation + 1,
            this.brain.copy(),
            this.score);
    }

    combine(anotherCell) {
        return new Cell(
            (this.pos.x + anotherCell.pos.x) / 2,
            (this.pos.y + anotherCell.pos.y) / 2,
            (this.r + anotherCell.r) / (2 * Math.sqrt(2)),
            color(
                constrain((this.color._getRed() + anotherCell.color._getRed()) / 2 + (Math.random() * 20 - 10), 0, 255),
                constrain((this.color._getGreen() + anotherCell.color._getGreen()) / 2 + (Math.random() * 20 - 10), 0, 255),
                constrain((this.color._getBlue() + anotherCell.color._getBlue()) / 2 + (Math.random() * 20 - 10), 0, 255),
                100
            ),
            Math.round((this.generation + anotherCell.generation) / 2) + 1,
            this.brain.copy(),
            Math.round((this.score + anotherCell.score) / 2)
        )
    }

    move() {
        this.pos.x = (this.pos.x + this.speed.x) % width;
        this.pos.y = (this.pos.y + this.speed.y) % height;
        if (this.pos.x < 0) {
            this.pos.x += width;
        }
        if (this.pos.y < 0) {
            this.pos.y += height;
        }
        if (this.pos.x > width) {
            this.pos.x -= width;
        }
        if (this.pos.y > height) {
            this.pos.y -= height;
        }
    }

    think(foods) {
        let closest = null;
        let closestD = Infinity;
        for (let i = 0; i < foods.length; i++) {
            let d = foods[i].pos.dist(this.pos);
            if (d < closestD && d > 0) {
                closest = foods[i];
                closestD = d;
            }
        }

        if (!closest) {
            return;
        }

        let inputs = [];
        inputs[0] = (closest.pos.y - this.pos.y) / height;
        inputs[1] = (closest.pos.x - this.pos.x) / width;
        let output = this.brain.predict(inputs);

        this.speed = createVector(output[0] - 0.5, output[1] - 0.5);
        this.speed.normalize();
    }

    mutate() {
        this.brain.mutate(0.1);
        return this;
    }

    eat(poisoned = false) {
        if (!poisoned) {
            this.score++;
            this.r += 3;
        } else {
            this.score--;
        }
    }

    show() {
        fill(this.color);
        stroke(255);
        circle(this.pos.x, this.pos.y, this.r * 2);
        textSize(13);
        fill(255);
        stroke(0);
        let insideTxt = "GEN " + this.generation + "\nR " + Math.round(this.r);
        text(insideTxt, this.pos.x - textWidth(insideTxt) / 4, this.pos.y); // 4 because there's a \n not counted in textWidth
        stroke(255);
        line(this.pos.x, this.pos.y, this.pos.x + this.speed.x * 50, this.pos.y + this.speed.y * 50);
    }

    static serializeArray(arr) {
        let toRet = [];
        for (let i = 0; i < arr.length; i++) {
            toRet[i] = {
                p: {
                    x: Math.round(arr[i].pos.x),
                    y: Math.round(arr[i].pos.y)
                },
                r: arr[i].r,
                c: arr[i].color.levels,
                s: {
                    x: Math.round(arr[i].speed.x),
                    y: Math.round(arr[i].speed.y)
                },
                // growthFactor: arr[i].growthFactor,
                // dieProb: arr[i].dieProb,
                g: arr[i].generation,
                // brain: arr[i].brain.serialize(),
                // score: arr[i].score,
                // fitness: arr[i].fitness
            }
        }
        return toRet;
    }

    static unserializeArray(arr) {
        let toRet = [];
        for (let i = 0; i < arr.length; i++) {
            toRet[i] = new Cell(arr[i].p.x, arr[i].p.y, arr[i].r, arr[i].c, arr[i].g);
        }
        return toRet;
    }

    static updateArray(arr, cells) {
        //console.log(cells);
        for (let i = 0; i < arr.length; i++) {
            //console.log(cells);
            if (cells[i]) {
                cells[i].pos.x = arr[i].p.x;
                cells[i].pos.y = arr[i].p.y;
                cells[i].r = arr[i].r;
                cells[i].color = arr[i].c;
                cells[i].generation = arr[i].g;
                cells[i].speed.x = arr[i].s.x;
                cells[i].speed.y = arr[i].s.y;
            } else {
                //console.log("CALLED");
                cells[i] = new Cell(arr[i].p.x, arr[i].p.y, arr[i].r, arr[i].c, arr[i].g);
            }
        }
        if (cells.length > arr.length) {
            cells.splice(arr.length - 1);
        }
    }
}