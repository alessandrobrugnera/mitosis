function Cell(x, y, r, c, g){

	this.pos = createVector(x ?? random(50, width - 50), y ?? random(50, height - 50));
	this.r = r ?? random(10, 20);
	this.color = c ?? color(255 - random(0,225), 255 - random(0,225), 255 - random(0,225), 100);
	this.speed = createVector(random(-1, 1), random(-1, 1));
	this.growthFactor = random(0.05, 0.07);
	this.dieProb = Math.random() * .005;
	this.generation = g ?? 0;


	this.timeToDie = function(){
		return this.dieProb > Math.random();
	}

	this.grow = function(){
		this.r += this.growthFactor;
	}

	this.timeToReproduce = function(){
		return this.r > 50;
	}

	this.generateChild = function(){
		return new Cell(
			this.pos.x - random(20, 40),
			this.pos.y - random(20, 40),
			this.r / Math.sqrt(2),
			this.color,
			this.generation + 1);
	}

	this.move = function(){
		this.pos.x = (this.pos.x + this.speed.x) % width;
		this.pos.y = (this.pos.y + this.speed.y) % height;
		if(this.pos.x < 0){
			this.pos.x += width;
		}
		if(this.pos.y < 0){
			this.pos.y += height;
		}
		if (this.pos.x > width) {
			this.pos.x -= width;
		}
		if (this.pos.y > height) {
			this.pos.y -= height;
		}
	}

	this.show = function(){
		fill(this.color);
		stroke(255);
		circle(this.pos.x, this.pos.y, this.r);
		textSize(13);
		fill(255);
		stroke(0);
		text(this.generation, this.pos.x, this.pos.y);
	}

}