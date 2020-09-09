class Freezer {
    Freezer(){}
    onClick(pos){
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].pos.dist(pos) < 75) {
                cells[i].speed = createVector(0, 0);
            }
        }
    };
    show(pos) {
        let txt = "Freezer";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
        stroke(0);
        fill(185, 232, 234, 100);
        circle(mouseX, mouseY, 150);
    }
}