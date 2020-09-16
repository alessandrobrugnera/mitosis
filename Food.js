class Food {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.poisoned = (Math.random() > 0.5);
    }

    show() {
        stroke(0);
        if (this.poisoned) {
            fill(0, 0, 255);
        } else {
            fill(255, 0, 0);
        }
        circle(this.pos.x, this.pos.y, 20);
    }

    static serializeArray(arr) {
        let toRet = [];
        for (let i = 0; i < arr.length; i++) {
            toRet[i] = {
                pos: {
                    x: arr[i].pos.x,
                    y: arr[i].pos.y
                },
                poisoned: arr[i].poisoned
            }
        }
        return toRet;
    }

    static unserializeArray(arr) {
        let toRet = [];
        for (let i = 0; i < arr.length; i++) {
            toRet[i] = new Food();
            toRet[i].pos = createVector(arr[i].pos.x, arr[i].pos.y)
            toRet[i].poisoned = arr[i].poisoned;
        }
        return toRet;
    }

    static updateArray(arr, foods) {
        for (let i = 0; i < arr.length; i++) {
            if (foods[i]) {
                foods[i].pos.x = arr[i].pos.x;
                foods[i].pos.y = arr[i].pos.y;
                foods[i].poisoned = arr[i].poisoned;
            } else {
                foods[i] = new Food();
                foods[i].pos = createVector(arr[i].pos.x, arr[i].pos.y)
                foods[i].poisoned = arr[i].poisoned;
            }
        }
        if (foods.length > arr.length) {
            foods.splice(arr.length - 1);
        }
    }

}