class NewCellTool{
    NewCellTool(){}
    onClick(pos){
        cells.push(new Cell(pos.x, pos.y));
    };
    show(pos) {
        let txt = "Cell Spawner";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
        stroke(0);
        fill(255, 255, 0);
        circle(mouseX, mouseY, 8);
    }
}