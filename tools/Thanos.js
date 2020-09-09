class Thanos {
    Thanos(){}
    onClick(pos) {
        for (let i = 0; i < cells.length; i++) {
            cells.splice(i, 1); // It actually deletes only half of theme since splice translates the entire array
        }
    }
    show(pos) {
        let txt = "Thanos";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
    }
}