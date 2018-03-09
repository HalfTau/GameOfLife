function Unit(game, x, y) {
    //this.spritesheet = AM.getAsset("./img/unit.PNG");
    this.animation = new Animation(AM.getAsset("./img/unit.PNG"), 0, 0, 18, 18, 90, 0.5, 5, true, 1)
    this.x = x;
    this.y = y;
    this.ctx = game.ctx;
    Entity.call(this, game, x, y);

};

Unit.prototype.draw = function () {
  console.log('hiasd');
  this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y );

      Entity.prototype.draw.call(this);
};

Unit.prototype.update = function () {
};
