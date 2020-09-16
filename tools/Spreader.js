class Spreader {
    Spreader() {
        this.intervalId = 0;
    }

    onPress() {
        this.intervalId = setInterval(() => {
            let pos = createVector(mouseX, mouseY);
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].pos.dist(pos) < 250) {
                    let tmp = pos.copy();
                    tmp.sub(cells[i].pos);
                    tmp.mult(-1);
                    tmp.setMag(cells[i].speed.mag())
                    cells[i].speed = tmp;
                }
            }
        }, 100);
    }

    onRelease() {
        clearInterval(this.intervalId);
    }

    show(pos) {
        let txt = "Spreader";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
        stroke(255);
        fill(0, 0, 255, 255);
        push();
        translate(mouseX, mouseY);
        rotate(millis() / 1000 * 2 * PI);
        triangle(0, 0, 20, -10, 20, 10);
        rotate(PI / 2);
        triangle(0, 0, 20, -10, 20, 10);
        rotate(PI / 2);
        triangle(0, 0, 20, -10, 20, 10);
        rotate(PI / 2);
        triangle(0, 0, 20, -10, 20, 10);
        pop();
        stroke(255);
        fill(0, 0, 0, 0);
        circle(mouseX, mouseY, 500);
    }
}