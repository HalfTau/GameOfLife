function Map(gameEngine) {
    this.game = gameEngine;
    this.mapList = [];
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
            var tile = new Tile(this.game, tileType, x, y);
            this.mapList[y][x] = tile;
        }
    }
}


// tiling going down
function Tile(game, tileType, x, y) {
    this.gfxString = '';
    this.tileString = "./img/tile.PNG";

    if (tileType === 0) {
        this.gfxString = this.tileString;
    }

    this.thing = null;
    this.game = game;
    this.x = x;
    this.y = y;
    this.tileType = tileType;
}
Tile.prototype = Object.create(Entity.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.addThing = function() {
  unit = new Unit(this.game, this.x, this.y);
  this.thing = unit;
  this.game.entities.push(this.thing);
}

Tile.prototype.removeThing = function(thing) {

  thing.removeFromWorld = true;
  this.thing = null;
}

Tile.prototype.getNeighbors = function () {
    let x = this.x;
    let y = this.y;
    let game = this.game;
    neighborCount = 0;
    if(x > 0) {
      if(game.map.mapList[y][x - 1].thing != null) {
        neighborCount++;
      }
    }
    if( x < 40) {
      if(game.map.mapList[y][x + 1].thing != null) {
        neighborCount++;
      }
    }
    if( y > 0) {
      if(game.map.mapList[y - 1][x].thing != null) {
        neighborCount++;
      }
      if(x > 0) {
        if(game.map.mapList[y-1][x-1].thing != null) {
          neighborCount++;
        }
      }
      if(x < 40) {
        if(game.map.mapList[y-1][x+1].thing != null) {
          neighborCount++;
        }
      }

    }
    if(y < 40) {
      if(game.map.mapList[y + 1][x].thing != null) {
        neighborCount++;
      }
      if(x > 0) {
        if(game.map.mapList[y+1][x-1].thing != null) {
          neighborCount++;
        }
      }
      if(x < 40) {
        if(game.map.mapList[y+1][x+1].thing != null) {
          neighborCount++;
        }
      }
    }

    return neighborCount;
}
Tile.prototype.hasUnit = function() {
  if(this.thing != null) {
    return true;
  }
  return false;
}

Tile.prototype.draw = function (ctx) {
    ctx.drawImage(
        AM.getAsset(this.gfxString),
          this.x * 20,
          this.y * 20
    );
}
