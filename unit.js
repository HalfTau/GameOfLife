function Unit(game, x, y) {
    //this.spritesheet = AM.getAsset("./img/unit.PNG");
    this.animation = new Animation(AM.getAsset("./img/unit.PNG"), 0, 0, 18, 18, 90, 0.5, 5, true, 1)
    this.ctx = game.ctx;
    Entity.call(this, game, x, y);

};
Unit.prototype = new Entity();
Unit.prototype.draw = function () {
  this.animation.drawFrame(this.game.clockTick, this.game.ctx, this.x * 20, this.y * 20 );

      Entity.prototype.draw.call(this);
};

Unit.prototype.update = function () {
};
