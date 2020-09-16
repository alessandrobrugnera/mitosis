class NoTool {
    NoTool() {
    }

    onClick(pos) {
    }

    show(pos) {
        let txt = "No Tool";
        stroke(255);
        fill(255);
        textSize(30);
        text(txt, pos.x, pos.y);
    }
}