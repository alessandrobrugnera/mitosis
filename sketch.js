let cells = [];

function setup() {
  createCanvas(innerWidth - 10, innerHeight - 10);
  for(let i = 0; i < 100; i++){
    cells.push(new cell());
  }
}

function draw() {
  background(0);
  for(let i = 0; i < cells.length; i++){
      if(cells[i].death()){
        cells.splice(i, 1);
      }else{
        cells[i].grow();
        if(cells[i].check()){
            cells.push(cells[i].duplicate());
            cells.push(cells[i].duplicate());
            cells.splice(i, 1);
        }
        cells[i].migrate();
        cells[i].show();  
      }
  }
}
