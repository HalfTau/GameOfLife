function GameEngine() {
    this.map = null;
    this.player = null;
    this.chars = [];
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}
var going = false;
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    setInterval(function gameLoop() {
        that.loop();
    }, 1000);
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 1024) {
            x = Math.floor(x / 20);
            y = Math.floor(y / 20);
        }

        return { x: x, y: y };
    }

    var that = this;
    // event listeners are added here
    var btn = document.getElementById("toggle");

    btn.addEventListener('click', function (e) {
      if(btn.value === 'Start') {
        going = true;
        btn.value = 'Stop';
      }
      else {
        going = false;
        btn.value = 'Start';
      }
    });

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
        let x = that.click.x;
        let y = that.click.y;
        that.map.mapList[y][x].addThing();
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        that.click = getXandY(e);
        console.log(e);
        console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
          that.chars[e.code] = true;
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
      that.chars[e.code] = false;
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.map.mapList.length; i++) {
        for (var j = 0; j < this.map.mapList[1].length; j++) {
            this.map.mapList[j][i].draw(this.ctx);
        }
    }

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    console.log('new');
    var entitiesCount = this.entities.length;
    let tiles = this.map.mapList;


    let adds = [];
    let jims = [];
    let addsLen = 0;
    let jimsLen = 0;
    for(let i = 0; i < tiles.length; i++) {
      for(let j = 0; j < tiles[1].length; j++) {
        let ncount = tiles[j][i].getNeighbors();
        if(tiles[j][i].hasUnit() === false) {
          if(ncount === 3) {
            console.log('hi');
            adds.push(j);
            adds.push(i);
            addsLen += 2;
          }
        }
      }
    }
    for(let i = 0; i < tiles.length; i++) {
      for(let j = 0; j < tiles[1].length; j++) {
      let ncount = tiles[j][i].getNeighbors();
      if(tiles[j][i].hasUnit() && (ncount < 2 || ncount > 3)) {
        console.log('hi?');
        jims.push(j);
        jims.push(i);
        jimsLen += 2;
      }
    }
  }
  for(let i = 0; i < jimsLen; i+= 2) {

    let j = jims[i];
    let b = jims[i + 1];
        console.log('wtf ' + j + ' ' + b);
    tiles[j][b].thing.removeFromWorld = true;
    console.log(tiles[j][b].thing.removeFromWorld)
    tiles[j][b].thing = null;
  }

  for(let i = 0; i < this.entities.length; i++) {
    console.log(this.entities);
    if(this.entities[i].removeFromWorld) {
      console.log('splice');
      this.entities.splice(i, 1);
    }
  }
  for(let i = 0; i < addsLen; i+= 2) {
    let j = adds[i];
    let b = adds[i + 1];
    tiles[j][b].addThing();
  }

}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    if(going) {
      this.update();
    }
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
