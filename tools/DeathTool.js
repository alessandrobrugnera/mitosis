class DeathTool {
    DeathTool(){}
    onClick(pos) {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].pos.dist(pos) < 75) {
                cells.splice(i, 1);
                i--; // Should not increment i for this cycle
            }
        }
    }
    show(pos) {
        let txt = "Cell Deleter";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
        stroke(0);
        fill(255, 255, 0, 90);
        circle(mouseX, mouseY, 150);
    }
}