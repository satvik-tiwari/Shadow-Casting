class Cell
{
  constructor()
  {
    this.edgeID = [4];
    //this.edgeID[0] = 1
    this.edgeExist = [4];
    this.exist = false;
  }

  getexist()
  {
    return this.exist;
  }

  setexist(value)
  {
    this.exist = val;
  }

  setedgeID(val)
  {
    //this.edgeID[val[1]] = val[0];
    this.edgeID = val;
    //print(val);
  }

  getedgeID()
  {
    //println(this.edgeID);
    return this.edgeID;
  }

  setedgeExist(val)
  {
    this.edgeExist = val;
  }

  getedgeExist()
  {
    return this.edgeExist;
  }
}
