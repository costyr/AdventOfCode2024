class Lee {
  constructor(aMap, aIsValidDirectionFunc) {
    this.mMap = aMap;
    this.mCostMap = [];
    this.mIsValidDirectionFunc = aIsValidDirectionFunc;
  }

  IsValidDirection(aDirection) {
    let x = aDirection.x;
    let y = aDirection.y;
    if ((y < 0) || (y >= this.mMap.length) ||
        (x < 0) || (x >= this.mMap[y].length))
      return false;

    if (this.mMap[y][x] == '#')
      return false;

   if (!this.mIsValidDirectionFunc(this.mMap[y][x]))
      return false;

    let posCharCode = this.mMap[y][x].charCodeAt(0);
    if ((posCharCode >= "A".charCodeAt(0)) && (posCharCode <= "Z".charCodeAt(0)))
      return false;

    return true;
  }

  FindValidDirections(aPos) {
    let x = aPos.x;
    let y = aPos.y;

    let posTop = { x: x, y: y + 1 };
    let posBottom = { x: x, y: y - 1 };
    let posLeft = { x: x - 1, y: y };
    let posRight = { x: x + 1, y: y };

    let directions = [];
    if (this.IsValidDirection(posTop))
      directions.push(posTop);

    if (this.IsValidDirection(posBottom))
      directions.push(posBottom);

    if (this.IsValidDirection(posLeft))
      directions.push(posLeft);

    if (this.IsValidDirection(posRight))
      directions.push(posRight);

    return directions;
  }

  GetCost(aPos) {
    if ((this.mCostMap[aPos.y] == undefined) ||
        (this.mCostMap[aPos.y][aPos.x] == undefined))
      return -1;
    return this.mCostMap[aPos.y][aPos.x];
  }

  SetCost(aPos, aCost) {
    if (this.mCostMap[aPos.y] == undefined)
        this.mCostMap[aPos.y] = [];

    this.mCostMap[aPos.y][aPos.x] = aCost;
  }

  ComputeLee(aStart) {
    this.mCostMap = [];
    let queue = [aStart];

    this.SetCost(aStart, 0);

    let pos;
    while (queue.length > 0) {
      pos = queue.pop();

      let cost = this.GetCost(pos);

      let directions = this.FindValidDirections(pos);
      for (let i = 0; i < directions.length; i++) {
        let neighbourCost = this.GetCost(directions[i])

        let newCost = cost + 1;

        if ((neighbourCost == -1) || (newCost < neighbourCost)) {
          this.SetCost(directions[i], newCost);
          queue.push(directions[i]);
        }
      }
    }
  }

  Visit(aFunction) {
    for (let i = 0; i < this.mCostMap.length; i++)
    {
      if (this.mCostMap[i] == undefined)
        continue;
      for (let j = 0; j < this.mCostMap[i].length; j++)
      {
        if (this.mCostMap[i][j] != undefined)
          aFunction(this.mCostMap[j][i]);
      }
    }
  }
}

module.exports = {
  Lee
}
