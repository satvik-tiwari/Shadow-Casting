var scl = 20;
var cols, rows, num_cells;
var cell = [];
var edges = [];
var visibilityPolygonPoints = []
var sx = 0;
var sy = 0;
let locked = false;
let radius = 1000000; //Why 1000000, well it works for me that's why
var bValid = false;
var uniqueVisibilityPolygonPoints = [] // for storing unique intersection points
let tile_sound;
let light_sound;
//check for radius & min distance idiot

function preload()
{
  tile_sound = loadSound("Sounds/CodingPower.mp3");
  light_sound = loadSound("Sounds/SciFi.mp3");
      //"Sounds/Input-02.mp3");
}

function setup()
{
  createCanvas(800, 600);
  colorMode(HSB);
  cols = floor(width/scl);
  rows = floor(height/scl);
  num_cells = cols * rows;
  for(let i = 0; i < num_cells; i++)
  cell.push(new Cell());

}

function draw()
{
  background(0);

  for(let y = 0; y < rows; y++)   // check for x=0 and x< rows i.e., boundary idiot
  {
    for(let x = 0; x < cols; x++)
    {
      let idx = x + y * cols;
      if(cell[idx].exist)
      {
        //console.log('exist');
        //stroke(0);
        noStroke();
        fill(231, 78, 85);
        rect(x*scl, y*scl, scl, scl);
      }
    }
  }
  ConvertTileMapToPolyMap();

  for(let edge of edges)
  {
    stroke(255);
    noStroke();
  }

  if(locked && visibilityPolygonPoints.length >= 1) // check for 1
  {
    temp = 0;
    uniqueVisibilityPolygonPoints = [];

    for(let i = 0; i < visibilityPolygonPoints.length; i += 2)
    uniqueVisibilityPolygonPoints.push(visibilityPolygonPoints[i]);

    for(let i = 0; i < uniqueVisibilityPolygonPoints.length - 1; i++)
    {// don't forget to change the length of visibilityPolygonPoints dumbass

      noStroke();
      stroke(255);
      fill(255);
      triangle(mouseX, mouseY, uniqueVisibilityPolygonPoints[i].x,
        uniqueVisibilityPolygonPoints[i].y, uniqueVisibilityPolygonPoints[i+1].x,
        uniqueVisibilityPolygonPoints[i+1].y);
      }
      triangle(mouseX, mouseY, uniqueVisibilityPolygonPoints[uniqueVisibilityPolygonPoints.length - 1].x,
        uniqueVisibilityPolygonPoints[uniqueVisibilityPolygonPoints.length - 1].y, uniqueVisibilityPolygonPoints[0].x,
        uniqueVisibilityPolygonPoints[0].y);
      }
    }

    function mousePressed()
    {
      if(mouseButton == LEFT)
      {
        // idx = y * width + x
        tile_sound.play();
        let idx = floor(mouseX/scl) + floor(mouseY/scl) * cols;
        cell[idx].exist = !(cell[idx].exist);
      }
    }

    function mouseDragged()
    {
      if(mouseButton == RIGHT)
      {
        locked = true;
        light_sound.play();
        calculateVisisbilityPolygon(mouseX, mouseY);
      }
    }

    function mouseReleased()
    {
      locked = false;
    }

    function ConvertTileMapToPolyMap()
    {
      // clear the p5.Vector
      edges = []
      for(let y = 1; y < rows-1; y++)
      {
        let idx = y * cols + 1;
        cell[idx].exist = true;

        idx = y * cols + 38;
        cell[idx].exist = true;
      }

      for(let x = 1; x < cols-1; x++)
      {
        let idx = 1 * cols + x;
        cell[idx].exist = true;

        idx = 1 * (cols * 28) + x;
        cell[idx].exist = true;
      }

      for(let y = 0; y < rows; y++)
      {
        for(let x = 0; x < cols; x++)
        {
          for(let i = 0; i < 4; i++)
          {
            let idx = (y + sy) * cols + (x + sx);
            //console.log(cell[idx]);
            cell[idx].edgeExist[i] = false;
            cell[idx].edgeID[i] = 0;
          }
        }
      }

      for(let y = 1; y < rows-1; y++)
      {
        for(let x = 1; x < cols-1; x++)
        {
          let c = (y + sy) * cols + (x + sx);     //current cell
          let n = (y + sy - 1) * cols + (x + sx); //northern cell
          let s = (y + sy + 1) * cols + (x + sx); //southern cell
          let e = (y + sy) * cols + (x + sx + 1); //eastern cell
          let w = (y + sy) * cols + (x + sx - 1); //western cell

          //  console.log(c);
          // check whether the current cell exists
          if(cell[c].exist)
          {
            //if the current cell exists check wheter it has a western neighbour
            if(!cell[w].exist)
            {
              //if there is no western neighbour then check for western edge
              if(cell[n].edgeExist[3])
              {
                //console.log('North Exists');
                //western edge id of the northern cell
                edges[cell[n].edgeID[3]].end.y += scl;
                /*western edge of current cell wil have the same id as the western
                edge of northern cell */
                cell[c].edgeID[3] = cell[n].edgeID[3];
                cell[c].edgeExist[3] = true;
              }
              else
              {
                let startX = (sx + x) * scl;
                let startY = (sy + y) * scl;
                endX = startX;
                endY = startY + scl;
                edges.push(new Edge(startX, startY, endX, endY));

                cell[c].edgeID[3] = edges.length - 1;
                cell[c].edgeExist[3] = true;
              }

            }

            //if the current cell exists check wheter it has a eastern neighbour
            if(!cell[e].exist)
            {
              //if there is no eastern neighbour then check for eastern edge which
              // can be extended from a northern neighbour
              //eastern edge is stored at index 2
              if(cell[n].edgeExist[2])
              {
                //eastern edge id of the northern cell

                edges[cell[n].edgeID[2]].end.y += scl;
                /*eastern edge of current cell will have the same id as the western
                edge of northern cell */
                cell[c].edgeID[2] = cell[n].edgeID[2];
                cell[c].edgeExist[2] = true;
              }
              else
              {
                startX = (sx + x + 1) * scl;
                startY = (sy + y) * scl;
                endX = startX;
                endY = startY + scl;
                edges.push(new Edge(startX, startY, endX, endY));

                cell[c].edgeID[2] = edges.length - 1;
                cell[c].edgeExist[2] = true;
              }

            }

            //if the current cell exists check wheter it has a northern neighbour
            if(!cell[n].exist)
            {
              //if there is no northern neighbour then check for northern edge
              //which can be extended from a western neighbour
              //northern edge is stored at index 0
              if(cell[w].edgeExist[0])
              {
                //northern edge id of the western cell
                //console.log(edges[cell[w].edgeID[0]].end.x)
                edges[cell[w].edgeID[0]].end.x += scl;

                /*northern edge of current cell wil have the same id as the northern
                edge of western cell */
                cell[c].edgeID[0] = cell[w].edgeID[0];
                cell[c].edgeExist[0] = true;
              }
              else
              {
                startX = (sx + x) * scl;
                startY = (sy + y) * scl;
                endX = startX + scl;
                endY = startY;
                edges.push(new Edge(startX, startY, endX, endY));

                cell[c].edgeID[0] = edges.length - 1;
                cell[c].edgeExist[0] = true;
              }

            }

            //if the current cell exists check wheter it has a southern neighbour
            if(!cell[s].exist)
            {
              //if there is no southern neighbour then check for southern edge from
              //a western neighbour
              //southern edge is stored at index 1
              if(cell[w].edgeExist[1])
              {
                //southern edge id of the western cell
                edges[cell[w].edgeID[1]].end.x += scl; // check whether .ey works or not
                /*western edge of current cell wil have the same id as the southern
                edge of western cell */
                cell[c].edgeID[1] = cell[w].edgeID[1];
                cell[c].edgeExist[1] = true;
              }
              else
              {
                startX = (sx + x) * scl;
                startY = (sy + y + 1) * scl;
                endX = startX + scl;
                endY = startY;
                edges.push(new Edge(startX, startY, endX, endY));

                cell[c].edgeID[1] = edges.length - 1; // check length function
                cell[c].edgeExist[1] = true;
              }
            }
          }
        }
      }
    }

    //calculating the visible plygons from a source point(sourceX, sourceY)
    function calculateVisisbilityPolygon(sourceX, sourceY)
    {
      visibilityPolygonPoints = []
      for(let edge of edges)
      {
        for(let i = 0; i < 2; i++)
        {
          var delta_x = (i == 0 ? edge.start.x : edge.end.x);
          var delta_y = (i == 1 ? edge.start.y : edge.end.y);

          let base_angle = atan2(delta_y - sourceY, delta_x - sourceX);

          for(let j = 0; j < 3; j++)
          {
            let angle;
            if(j == 0)
            angle = base_angle - 0.01; // play with this later
            if(j == 1)
            angle = base_angle;
            if(j == 2)
            angle = base_angle + 0.01;

            // we want a got damn fucking line in the direction of both starting and
            // ending point of every edge from the light source so as to find the intersection
            // point between this line and the edge itself, this we do for all edges.

            let min_distance = 100000000000;
            let min_x = 0, min_y = 0, min_ang = 0;
            bValid = false;

            for(let edge_ of edges)
            {
              let P1;
              if(j == 1)
              {
                P1 = {//fuck trying to find angle
                  // x : radius * cos(angle),
                  // y : radius * sin(angle)

                  x : delta_x,
                  y : delta_y
                };
              }

              else {
                P1 = {
                  x : radius * cos(angle),
                  y : radius * sin(angle)
                };
              }

              let P0 = {
                x : sourceX,
                y : sourceY
              },

              P2 = {
                x : edge_.start.x,
                y : edge_.start.y
              },

              P3 = {
                x : edge_.end.x,
                y : edge_.end.y
              };

              let intersect = calculateIntersectionPoint(P0,P1,P2,P3);

              if(intersect)
              {
                let distance = sqrt(sq(P0.x - intersect.x) + sq(P0.y - intersect.y));
                if(distance < min_distance)
                {
                  min_distance = distance;
                  min_x = intersect.x;
                  min_y = intersect.y;
                  min_ang = atan2(min_y - sourceY, min_x - sourceX);
                  bValid = true;
                }

              }

            }
            if(bValid)
            visibilityPolygonPoints.push(new visibilityPolygonPoint(min_ang, min_x, min_y));

            //TRY THE OTHER ALGO FOR INTERSECTION
          }
        }
      }
      visibilityPolygonPoints.sort(function(a, b) {
        if(a.ang < b.ang) return -1;
        else if(a.ang > b.ang) return 1;
        else return 0;
      });
    }

    function calculateIntersectionPoint(P0, P1, P2, P3)
    {
      let A1, B1, C1, A2, B2, C2, denom;

      A1 = P1.y - P0.y;
      B1 = P0.x - P1.x;
      C1 = A1 * P0.x + B1 * P0.y;

      A2 = P3.y - P2.y;
      B2 = P2.x - P3.x;
      C2 = A2 * P2.x + B2 * P2.y;

      denom = (A1 * B2) - (A2 * B1);

      if(denom == 0)
      return null;


      let Px = ((B2 * C1) - (B1 * C2))/denom,
      Py = ((A1 * C2) - (A2 * C1))/denom,
      rx0 = (Px - P0.x) / (P1.x - P0.x),
      ry0 = (Py - P0.y) / (P1.y - P0.y),
      rx1 = (Px - P2.x) / (P3.x - P2.x) ,
      ry1 = (Py - P2.y) / (P3.y - P2.y);
      if(((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
      ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1)))
      {
        return {
          x : Px,
          y : Py
        };
      }

      else{
        return null;
      }

    }
