function cell(x, y, r, c){

	this.x = x || random(50, width - 50); 
	this.y = y || random(50, height - 50);
	this.r = r || random(10, 20);
	this.color = c || color(255 - random(0,225), 255 - random(0,225), 255 - random(0,225), 100);
	this.xspeed = random(-1, 1);
	this.yspeed = random(-1, 1);
	this.growthFactor = random(0.05, 0.07);
	this.dieProbability = Math.floor(random(100));


	this.death = function(){
		return this.dieProbability < 45;
	}

	this.grow = function(){
		this.r += this.growthFactor;
	}

	this.check = function(){
		return this.r > 50;
	}

	this.duplicate = function(){
		return new cell(this.x - random(20, 40), this.y - random(20, 40), this.r / Math.sqrt(2), this.color);
	}

	this.migrate = function(){
		this.x = (this.x + this.xspeed) % width;
		this.y = (this.y + this.yspeed) % height;
		if(this.x < 0){
			this.x += width;
		}
		if(this.y < 0){
			this.y += height;
		}
	}

	this.show = function(){
		fill(this.color);
		stroke(255);
		ellipse(this.x, this.y, this.r, this.r);	
	}

}