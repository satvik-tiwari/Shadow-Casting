 class Edge
{
  constructor(sx, sy, ex, ey)
  {
    this.start = new p5.Vector(sx, sy);
    this.end = new p5.Vector(ex, ey);
  }

  getstart()
  {
    return this.start;
  }

  getend()
  {
    return this.end;
  }


}
