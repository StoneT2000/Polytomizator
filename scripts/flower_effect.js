//This is the old method of displaying triangles, which is directly to the canvas. Faster method to display flower effect
function delaunayDisplay_flower_effect(tng) {
  for (var i = 0; i < tng.length; i += 3) {
    if (tColors[i] >= 0 && noColors == false) {

      fill(tColors[i], tColors[i + 1], tColors[i + 2]);
      stroke(tColors[i], tColors[i + 1], tColors[i + 2]);
    } else if (noColors == true) {
      fill(256, 256, 256);
      stroke(10, 10, 10);
    } else if (tColors[i] == -1) {
      noFill();
      noStroke();

    } else {
      fill(256, 256, 256);
      stroke(10, 10, 10);
    }

    if (verticesHashTableFlat.length > 0) {


      //Normal
      if (displayMode == 0) {
        triangle(verticesHashTableFlat[tng[i]][0], verticesHashTableFlat[tng[i]][1], verticesHashTableFlat[tng[i + 1]][0], verticesHashTableFlat[tng[i + 1]][1], verticesHashTableFlat[tng[i + 2]][0], verticesHashTableFlat[tng[i + 2]][1]);
      }
      //Rectangle mode, displays smallest rectangle that encompasses triangle such that sides are parallel to canvas 
      else if (displayMode == 1) {

        var xcoords = [verticesHashTableFlat[tng[i]][0], verticesHashTableFlat[tng[i + 1]][0], verticesHashTableFlat[tng[i + 2]][0]]
        var ycoords = [verticesHashTableFlat[tng[i]][1], verticesHashTableFlat[tng[i + 1]][1], verticesHashTableFlat[tng[i + 2]][1]]
        var lowx = xcoords[0];
        var lowy = ycoords[0];
        var highx = -1;
        var highy = -1;
        //find top left and bottom right corners
        for (xi = 0; xi < xcoords.length; xi++) {
          if (xcoords[xi] < lowx) {
            lowx = xcoords[xi];
          }
          if (xcoords[xi] > highx) {
            highx = xcoords[xi];
          }
          if (ycoords[xi] < lowy) {
            lowy = ycoords[xi];
          }
          if (ycoords[xi] > highy) {
            highy = ycoords[xi];
          }
        }
        rect(lowx, lowy, highx - lowx, highy - lowy);
      }
      //Circle mode, displays circles that encompass the triangle using the circumcenter.
      else if (displayMode == 2) {
        var coords = circumcenter(verticesHashTableFlat[tng[i]][0], verticesHashTableFlat[tng[i]][1], verticesHashTableFlat[tng[i + 1]][0], verticesHashTableFlat[tng[i + 1]][1], verticesHashTableFlat[tng[i + 2]][0], verticesHashTableFlat[tng[i + 2]][1]);
        var px = coords.x;
        var py = coords.y;
        var size = 2 * sqrt(squaredist(verticesHashTableFlat[tng[i]][0], verticesHashTableFlat[tng[i]][1], px, py));

        ellipse(px, py, size, size);

      }
      //Odd animated looking triangles. Looks like water almost
      else if (displayMode == 3) {
        triangle(verticesHashTableFlat[tng[i]][0], verticesHashTableFlat[tng[i]][1], verticesHashTableFlat[tng[i + 1]][0], verticesHashTableFlat[tng[i + 1]][1], verticesHashTableFlat[tng[i + 2]][0], verticesHashTableFlat[tng[i + 2]][1]);

        triangle(verticesHashTableFlat[tng[i]][0] + random(-sd, sd), verticesHashTableFlat[tng[i]][1] + random(-sd, sd), verticesHashTableFlat[tng[i + 1]][0] + random(-sd, sd), verticesHashTableFlat[tng[i + 1]][1] + random(-sd, sd), verticesHashTableFlat[tng[i + 2]][0] + random(-sd, sd), verticesHashTableFlat[tng[i + 2]][1] + random(-sd, sd));
      }
      //Odd animated looking rectangles
      else if (displayMode == 4) {
        var xcoords = [verticesHashTableFlat[tng[i]][0], verticesHashTableFlat[tng[i + 1]][0], verticesHashTableFlat[tng[i + 2]][0]]
        var ycoords = [verticesHashTableFlat[tng[i]][1], verticesHashTableFlat[tng[i + 1]][1], verticesHashTableFlat[tng[i + 2]][1]]
        var lowx = xcoords[0];
        var lowy = ycoords[0];
        var highx = -1;
        var highy = -1;
        //find top left and bottom right corners
        for (xi = 0; xi < xcoords.length; xi++) {
          if (xcoords[xi] < lowx) {
            lowx = xcoords[xi];
          }
          if (xcoords[xi] > highx) {
            highx = xcoords[xi];
          }
          if (ycoords[xi] < lowy) {
            lowy = ycoords[xi];
          }
          if (ycoords[xi] > highy) {
            highy = ycoords[xi];
          }
        }
        rect(lowx, lowy, highx - lowx, highy - lowy);
        rect(lowx + random(-sd, sd), lowy + random(-sd, sd), highx - lowx + random(-sd, sd), highy - lowy + random(-sd, sd));
      }
    }
  }
}