var AM = new AssetManager();
    var gameEngine = new GameEngine();
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX * frameWidth;
    this.startY = startY * frameHeight;
    this.frameWidth = frameWidth;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

var socket = io.connect("http://24.16.255.56:8888");
var unitdata;
 socket.on("connect", function() {
   console.log("Socket connected.")
 });
 socket.on("disconnect", function () {
   console.log("Socket disconnected.")
 });
 socket.on("reconnect", function () {
   console.log("Socket reconnected.")
 });
 socket.on("load", function (data) {
    going = false;
    unitdata = JSON.parse(data['entities'])

    loadupUnits();
});

function loadupUnits() {
  for(let i = 0; i < gameEngine.entities.length; i++) {
    gameEngine.entities.splice(i, 1);
    i--;
  }
  for(let i = 0; i < unitdata.length; i++) {
    gameEngine.map.mapList[unitdata[i].y][unitdata[i].x].addThing();
  }
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
      //just a sec
    var colIndex = this.currentFrame() % this.sheetWidth
    var rowIndex = Math.floor(this.currentFrame() / this.sheetWidth);

    if ((colIndex + 1) * this.frameWidth > this.spriteSheet.width) {
        rowIndex++;
    }

    ctx.drawImage(this.spriteSheet, colIndex * this.frameWidth + this.startX,
        rowIndex * this.frameHeight + this.startY, this.frameWidth,
        this.frameHeight, x, y, this.frameWidth * this.scale, this.frameHeight * this.scale);
}


Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

AM.queueDownload("./img/tile.PNG");
AM.queueDownload("./img/unit.PNG");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");


    gameEngine.map = new Map(gameEngine);

    gameEngine.map.readMap(new MapData().map);

    gameEngine.init(ctx);
    gameEngine.start();

    console.log("All Done!");
});
