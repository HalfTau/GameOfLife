function Map(gameEngine) {
    this.game = gameEngine;
    this.simpleMapData = [];
    this.mapList = [];
    // Note: not needed when you give mapData.

}
Map.prototype.constructor = Map;

Map.prototype.readMap = function (mapData) {

    for (i = 0; i < mapData.length; i++) {
        this.mapList[i] = new Array(mapData.length);
        console.log()
        for (j = 0; j < mapData[i].length; j++) {
            x = j;
            y = i;
            tileType = mapData[x][y];
            //console.log(twodtoisoX(x, y) + ' '+ twodtoisoY(x, y));
            var tile = new Tile(this.game, tileType, x, y);
            //this.game.addEntity(tile);
            this.mapList[y][x] = tile;
        }
    }
}

// tiling going down
function Tile(game, tileType, x, y) {
    //this.animation = new Animation(ASSET_MANAGER.getAsset("./img/grass.png"), 0, 0, 58, 30, 1, .15, 1, true);
    this.gfxString = '';
    this.normalImage = "./img/tile.PNG";

    if (tileType === 0) {
        this.gfxString = this.normalImage;
    }

    this.thing = null;
    this.game = game;
    this.x = x;
    this.y = y;
    this.tileType = tileType;
}
Tile.prototype = Object.create(Entity.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.draw = function (ctx) {
    ctx.drawImage(
        AM.getAsset(this.gfxString),
          this.x * 20,
          this.y * 20
    );
}
