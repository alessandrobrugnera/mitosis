class Exploder {
    Exploder() {
    }

    onClick() {
        let pos = createVector(mouseX, mouseY);
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].pos.dist(pos) < 250) {
                let tmp = pos.copy();
                tmp.sub(cells[i].pos);
                tmp.mult(-1);
                tmp.setMag(50);
                cells[i].speed = tmp;
            }
        }
    }

    show(pos) {
        let txt = "Exploder";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
        stroke(255);
        fill(255, 0, 0, 255);
        push();
        translate(mouseX, mouseY);
        rotate(millis() / 1000 * 2 * PI);
        rect(-10, -10, 20, 20);
        pop();
        stroke(255);
        fill(0, 0, 0, 0);
        circle(mouseX, mouseY, 500);
    }
}