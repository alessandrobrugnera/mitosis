class GrabberTool {
    GrabberTool() {
        this.cellToAttract = undefined;
    }

    onPress() {
        let minDist = Infinity;
        let tmpPos = createVector(mouseX, mouseY);
        for (let i = 0; i < cells.length; i++) {
            if (tmpPos.dist(cells[i].pos) < minDist) {
                minDist = tmpPos.dist(cells[i].pos);
                this.cellToAttract = cells[i];
            }
        }
        this.intervalId = setInterval(() => {
            let pos = createVector(mouseX, mouseY);
            if (typeof this.cellToAttract !== 'undefined') {
                this.cellToAttract.pos = pos;
            }
        }, 100);
    }

    onRelease() {
        clearInterval(this.intervalId);
    }

    show(pos) {
        let txt = "Grabber";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
        stroke(255);
        fill(255);
        circle(mouseX, mouseY, 20);
    }
}