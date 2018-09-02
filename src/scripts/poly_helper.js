var hashing_size = 50; //shouldn't be too small
//Create a hash out of the x,y coordinates
function hashCoordinate(x, y) {
  return floor((x) / hashing_size) * 100 + floor(y / hashing_size);
}
//Find the index of the hashed value in the verticesHashTable array
function findIndexFromHash(hash) {
  var xi = floor((hash / 100));
  var yi = hash % 100;
  return xi + yi * ceil(cWidth / hashing_size)
}

//Genearte verticesHashTable array, which is the array containing the coords of every vertice in a hashed array index.
function generateHashSpace() {
  totalpoints = 0;
  verticesHashTable = [];
  //hashing_size x hashing_size squares in grid
  for (i = 0; i <= ceil((cWidth / hashing_size)+1) * ceil((cHeight / hashing_size)+1); i++) {
    verticesHashTable.push([]);

  }
}

//Add or delete a vertex.
function updateHashSpace(x, y, add) {


  var hashVal = hashCoordinate(x, y);
  var index = findIndexFromHash(hashVal);
  if (add == true) {
    //console.log("x: " + x,"y: "+ y,"hashValue: " + hashVal, "index:" + index);
    verticesHashTable[index].push([x, y])
    totalpoints++;
  }
  if (add == false) {
    //If deleting, we find the proper index, then proceed to search for that vertex with that coordinate and splice it
    for (i = 0; i < verticesHashTable[index].length; i++) {

      if (verticesHashTable[index][i][0] == x && verticesHashTable[index][i][1] == y) {
        verticesHashTable[index].splice(i, 1)
        totalpoints--;
      }
    }
  }
}

function unique_vertex(x, y) {
  //Check if vertex at x,y exists or not
  var uvindex = findIndexFromHash(hashCoordinate(x, y));
  for (var g = 0; g < verticesHashTable[uvindex].length; g++) {
    if (verticesHashTable[uvindex][g][0] == x && verticesHashTable[uvindex][g][1] == y) {
      //not unique
      return false;
    }
  }
  return true;
}

function keyPressed(event) {
  //Space
  if (keyCode === 32) {
    downloading = true;
    //draw();
    //saveCanvas(myCanvas, 'myCanvas', 'jpg');
    downloading = false;
  }
  //D
  else if (keyCode === 68) {
    triangulate_and_display();
  }
  //C
  else if (keyCode === 67) {
    if (noColors === false) {
      noColors = true;
      css_buttons.displayColor(false);

    } else {
      noColors = false;
      css_buttons.displayColor(true);
    }
    if (flowerEffect) {

    } else {
      for (j = 0; j < triangulations.length; j++) {
        delaunayDisplay(triangulations[j], triangleCanvasLayer);
      }
    }
  }
  //P
  else if (keyCode === 80) {
    mode = 1;
    removeClassFromBrushes("active");
    $("#pointBrush").addClass("active");

  }
  //E
  else if (keyCode === 69) {
    mode = 3;
    removeClassFromBrushes("active");
    $("#eraser").addClass("active");
  }
  //B
  else if (keyCode === 66) {
    mode = 2;
    removeClassFromBrushes("active");
    $("#lineBrush").addClass("active");
  }
  //T
  else if (keyCode === 84) {
    mode = 4;
    removeClassFromBrushes("active");
    $("#triangleMove").addClass("active");
  }
  /*
  //=
  else if (keyCode === 61) {
    resize_poly_canvas(1.2);
  }
  //-
  else if (keyCode === 173){
    resize_poly_canvas(1/1.2)
  }
  */
}

//Equivalent to pressing polytomize or D. Triangulate the data, tell draw() to begin coloring, check for flower effect option, load image into background, reset colors, and undisplay things.
function triangulate_and_display() {
  triangulize();

  //Tell draw() to draw in colors once by setting this false. It will turn back to true once it is finished
  finishedColoring = false;


  //Settings for flower effect
  if (flowerEffect) {
    flower_step = 0;
    flowering = true;
  }

  //Load image
  image(img1, 0, 0, cWidth, cHeight);
  noColors = false;
  css_buttons.displayColor(true);
  displayPoints = false;
  css_buttons.displayPoints(false);
  //Load the pixels of said image
  loadPixels();

  //Reset the colors calculated
  tColors = [];

  sTime = millis();
}

function mouseClicked() {
  //Check if click is within canvas
  if (active_canvas === true) {
    if (mouseX <= cWidth && mouseX >= 0) {
      if (mouseY <= cHeight && mouseY >= 0) {
        //console.log(erase_vertices(mouseX,mouseY,100))
        if (mode == 1) {
          var vpx = round(mouseX);
          var vpy = round(mouseY);
          if (snapping == true) {
            vpx = vpx - vpx % snappingAccuracy;
            vpy = vpy - vpy % snappingAccuracy;
          }
          if (unique_vertex(vpx, vpy)) {
            updateHashSpace(vpx, vpy, true)

          }
        }
        if (mode == 2) {}
        if (mode === 4) {
          //triangle flipper
          var tng = triangulations[0];
          for (k = 0; k < tng.length; k += 3) {
            if (pointInTriangle(verticesHashTableFlat[tng[k]][0], verticesHashTableFlat[tng[k]][1], verticesHashTableFlat[tng[k + 1]][0], verticesHashTableFlat[tng[k + 1]][1], verticesHashTableFlat[tng[k + 2]][0], verticesHashTableFlat[tng[k + 2]][1], mouseX, mouseY)) {
              if (tColors[k] >= 0) {
                tColors[k] = -1;
              } else if (tColors[k] == -1) {
                var tAC = [0, 0, 0];
                tAC = averageColor(verticesHashTableFlat[tng[k]][0], verticesHashTableFlat[tng[k]][1], verticesHashTableFlat[tng[k + 1]][0], verticesHashTableFlat[tng[k + 1]][1], verticesHashTableFlat[tng[k + 2]][0], verticesHashTableFlat[tng[k + 2]][1], colorAccuracy)
                tColors[k] = tAC[0];
                tColors[k + 1] = tAC[1];
                tColors[k + 2] = tAC[2];
              }
            }
          }

        }
        //Record past vertices sets for undoing
        recordVertices();

      }


    }
  }

}

function erase_vertices(x, y, radius) {

  //Find top left corner of the square eraser is in
  var px = floor(round(x) / hashing_size) * hashing_size;
  var py = floor(round(y) / hashing_size) * hashing_size;
  var eraser_index = findIndexFromHash(hashCoordinate(px, py));

  //Proceed to search around this eraser_index
  //Basically, +,- hashing_size around it depending on radius
  var search_indices = [];
  for (var t = -ceil(radius / hashing_size); t <= ceil(radius / hashing_size); t++) {
    for (var k = -ceil(radius / hashing_size); k <= ceil(radius / hashing_size); k++) {
      //Take some point, hashing_size multiple away from eraser, check if its in canvas still
      var cx = px + hashing_size * t;
      var cy = py + hashing_size * k;
      if (inCanvas(cx, cy)) {
        search_indices.push(findIndexFromHash(hashCoordinate(cx, cy)));
      }
    }
  }

  var flagged_to_erase = [];
  for (var t = 0; t < search_indices.length; t++) {

    for (var k = 0; k < verticesHashTable[search_indices[t]].length; k++) {
      var vhtk = verticesHashTable[search_indices[t]][k];

      if (squaredist(vhtk[0], vhtk[1], x, y) <= radius * radius) {
        //Flag for erase so we don't end up not erasing some because we dynamically removed it from the array.
        flagged_to_erase.push(vhtk[0], vhtk[1]);
      }
    }
  }
  for (var t = 0; t < flagged_to_erase.length; t += 2) {
    updateHashSpace(flagged_to_erase[t], flagged_to_erase[t + 1], false)
  }


}

function snapVertices(acc) {
  //acc is snapping accuracy
  if (!acc) {
    acc = 20;
  }
  for (in1 = 0; in1 < verticesHashTable.length; in1++) {
    for (in2 = 0; in2 < verticesHashTable[in1].length; in2++) {
      var fixx = true;
      var fixy = true;
      if (verticesHashTable[in1][in2][0] == cWidth) {
        fixx = false;
      }
      if (verticesHashTable[in1][in2][1] == cHeight) {
        fixy = false;
      }
      if (fixx) {
        if (verticesHashTable[in1][in2][0] % acc < acc / 2) {
          verticesHashTable[in1][in2][0] = verticesHashTable[in1][in2][0] - (verticesHashTable[in1][in2][0] % acc)

        } else {
          verticesHashTable[in1][in2][0] = verticesHashTable[in1][in2][0] + 20 - (verticesHashTable[in1][in2][0] % acc)
        }
      }
      if (fixy) {
        if (verticesHashTable[in1][in2][1] % acc < acc / 2) {
          verticesHashTable[in1][in2][1] = verticesHashTable[in1][in2][1] - (verticesHashTable[in1][in2][1] % acc)
        } else {
          verticesHashTable[in1][in2][1] = verticesHashTable[in1][in2][1] + 20 - (verticesHashTable[in1][in2][1] % acc)
        }
      }
    }
  }
  recordVertices();
}

//Deviation of triangle coords for animated triangles
var sd = 15;
//Display all the triangles in tng. Displays them using the variable verticesarr = verticesHashTableFlat.
function delaunayDisplay(tng, ctx, vertices_set, flower_effect, flowering_step, flower_speed) {

  //we use triangulatedVerticesFlat as it is corresponding with tng
  var verticesarr = triangulatedVerticesFlat;
  if (vertices_set) {
    //Use this if we don't want to use verticesHashTableFlat directly
    verticesarr = vertices_set
  }
  //ctx.fill('RGBA(255,255,255,0)');
  //ctx.rect(0,0,cWidth,cHeight)

  if (flower_step === 0 && flower_effect) {
    //First display empty triangles
    uncoloredTriangleCanvasLayer = createGraphics(cWidth, cHeight);
    colorIn();
    sTime = millis();
    if (displayImage === true) {
      ctx.image(img1, 0, 0, cWidth, cHeight);
      uncoloredTriangleCanvasLayer.image(img1, 0, 0, cWidth, cHeight);
    } else {
      ctx.fill(255);
      ctx.rect(0, 0, cWidth, cHeight)
      uncoloredTriangleCanvasLayer.fill(255);
      uncoloredTriangleCanvasLayer.rect(0, 0, cWidth, cHeight)
    }
    ctx.fill(256, 256, 256);
    ctx.stroke(10, 10, 10);
    uncoloredTriangleCanvasLayer.fill(256, 256, 256);
    uncoloredTriangleCanvasLayer.stroke(10, 10, 10);
    if (verticesarr.length > 0) {
      for (var i = 0; i < tng.length; i += 3) {
        construct_shape_from_vertices(verticesarr, ctx, tng, i);

        construct_shape_from_vertices(verticesarr, uncoloredTriangleCanvasLayer, tng, i);
      }
    }

  }
  if (flower_effect) {
    var coloring_speed = 1;
    if (flower_speed) {
      coloring_speed = flower_speed;
    }
    //console.log(coloring_speed);
    for (i = flowering_step * 3; i < (flowering_step * 3) + 3 * coloring_speed; i += 3) {
      //console.log(i);
      if (i < tng.length) {
        if (tColors[i] >= 0) {

          ctx.fill(tColors[i], tColors[i + 1], tColors[i + 2]);
          ctx.stroke(tColors[i], tColors[i + 1], tColors[i + 2]);
        } else {
          ctx.fill(256, 256, 256);
          ctx.stroke(10, 10, 10);
        }

        if (verticesarr.length > 0) {
          construct_shape_from_vertices(verticesarr, ctx, tng, i);
        }

      }
    }

  } else {
    //Clear background, then draw
    if (displayImage === true) {
      ctx.image(img1, 0, 0, cWidth, cHeight);

    } else {
      ctx.fill(255);
      ctx.rect(0, 0, cWidth, cHeight)
    }
    var iteration_max;
    var iteration_start;
    var coloring_speed = 1;
    if (flower_effect) {

      if (flower_speed) {
        coloring_speed = flower_speed;
        iteration_max = (flowering_step * 3) + 3 * coloring_speed;
      }
    } else {
      iteration_start = 0;
      iteration_max = tng.length;
    }
    for (var i = iteration_start; i < iteration_max; i += 3) {
      if (tColors[i] >= 0 && noColors == false) {

        ctx.fill(tColors[i], tColors[i + 1], tColors[i + 2]);
        ctx.stroke(tColors[i], tColors[i + 1], tColors[i + 2]);
      } else if (noColors == true) {
        ctx.fill(256, 256, 256);
        ctx.stroke(10, 10, 10);
      } else if (tColors[i] == -1) {
        ctx.noFill();
        ctx.noStroke();

      } else {
        ctx.fill(256, 256, 256);
        ctx.stroke(10, 10, 10);
      }

      if (verticesarr.length > 0) {
        construct_shape_from_vertices(verticesarr, ctx, tng, i);
      }
    }
  }
}

//Construct a shape based on display mode onto canvas ctx, given teh vertices and trianglulation and iteration values.
function construct_shape_from_vertices(verticesarr, ctx, tng, i) {
  if (displayMode == 0) {
    ctx.triangle(verticesarr[tng[i]][0], verticesarr[tng[i]][1], verticesarr[tng[i + 1]][0], verticesarr[tng[i + 1]][1], verticesarr[tng[i + 2]][0], verticesarr[tng[i + 2]][1]);
  }
  //Rectangle mode, displays smallest rectangle that encompasses triangle such that sides are parallel to canvas 
  else if (displayMode == 1) {

    var xcoords = [verticesarr[tng[i]][0], verticesarr[tng[i + 1]][0], verticesarr[tng[i + 2]][0]]
    var ycoords = [verticesarr[tng[i]][1], verticesarr[tng[i + 1]][1], verticesarr[tng[i + 2]][1]]
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
    ctx.rect(lowx, lowy, highx - lowx, highy - lowy);
  }
  //Circle mode, displays circles that encompass the triangle using the circumcenter.
  else if (displayMode == 2) {
    var coords = circumcenter(verticesarr[tng[i]][0], verticesarr[tng[i]][1], verticesarr[tng[i + 1]][0], verticesarr[tng[i + 1]][1], verticesarr[tng[i + 2]][0], verticesarr[tng[i + 2]][1]);
    var px = coords[0];
    var py = coords[1];
    var size = 2 * sqrt(squaredist(verticesarr[tng[i]][0], verticesarr[tng[i]][1], px, py));

    ctx.ellipse(px, py, size, size);

  }
  //Odd animated looking triangles. Looks like water almost
  else if (displayMode == 3) {
    ctx.triangle(verticesarr[tng[i]][0], verticesarr[tng[i]][1], verticesarr[tng[i + 1]][0], verticesarr[tng[i + 1]][1], verticesarr[tng[i + 2]][0], verticesarr[tng[i + 2]][1]);

    ctx.triangle(verticesarr[tng[i]][0] + random(-sd, sd), verticesarr[tng[i]][1] + random(-sd, sd), verticesarr[tng[i + 1]][0] + random(-sd, sd), verticesarr[tng[i + 1]][1] + random(-sd, sd), verticesarr[tng[i + 2]][0] + random(-sd, sd), verticesarr[tng[i + 2]][1] + random(-sd, sd));
  }
  //Odd animated looking rectangles
  else if (displayMode == 4) {
    var xcoords = [verticesarr[tng[i]][0], verticesarr[tng[i + 1]][0], verticesarr[tng[i + 2]][0]]
    var ycoords = [verticesarr[tng[i]][1], verticesarr[tng[i + 1]][1], verticesarr[tng[i + 2]][1]]
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
    ctx.rect(lowx, lowy, highx - lowx, highy - lowy);
    ctx.rect(lowx + random(-sd, sd), lowy + random(-sd, sd), highx - lowx + random(-sd, sd), highy - lowy + random(-sd, sd));
  }
}


//Below function taken from delaunator
function circumcenter(ax, ay, bx, by, cx, cy) {
  var dx = bx - ax;
  var dy = by - ay;
  var ex = cx - ax;
  var ey = cy - ay;

  var bl = dx * dx + dy * dy;
  var cl = ex * ex + ey * ey;
  var d = dx * ey - dy * ex;

  var x = ax + (ey * bl - dy * cl) * 0.5 / d;
  var y = ay + (dx * cl - ex * bl) * 0.5 / d;

  return [x, y];
}

function loadData(dataStored) {
  if (dataStored === null) {
    alert("No recently saved data")
  }
  triangulations = dataStored[0];
  tColors = dataStored[1];
  verticesHashTable = dataStored[2];
  verticesHashTableFlat = dataStored[3];
  //img1 = dataStored[4];
  cWidth = dataStored[4];
  cHeight = dataStored[5];
  myCanvas = resizeCanvas(cWidth, cHeight);
  $("#gamedisplay").css("width", cWidth);
  $("#gamedisplay").css("margin-left", -cWidth/2);
  triangulize();



  displayPoints = true;
  css_buttons.displayPoints(true);
  for (j = 0; j < triangulations.length; j++) {
    delaunayDisplay(triangulations[j], triangleCanvasLayer);

  }
  recordVertices();
}

function saveData(location) {
  var location_name = "art1";
  if (location) {
    location_name = location;
  }
  //image(img1, 0, 0, cWidth, cHeight);
  //loadPixels();
  var currentData = [triangulations.slice(), tColors.slice(), verticesHashTable.slice(), verticesHashTableFlat.slice(), cWidth, cHeight];
  localStorage.setItem(location_name, JSON.stringify(currentData));

}

function expandVertex(vertex, expandValue) {
  
  return [vertex[0] * expandValue, vertex[1] * expandValue];

}

function lineAngle(x1, y1, x2, y2) {
  var angleconstant = 0;
  if (x2 - x1 >= 0) {
    angleconstant = 0;
    if (y2 - y1 >= 0) {
      angleconstant = 360;
    }
  } else {
    var angleconstant = 180;
  }
  return -atan((y2 - y1) / (x2 - x1)) + angleconstant;
}

//Expand the vertices to download large scale image
var downloadcanvas;

function expandImage(mvalue, save) {

  var expandedWidth = cWidth * mvalue;
  var expandedHeight = cHeight * mvalue;

  //Change the sd value to accomodate new size for those downloading the distorted triangulations
  sd *= mvalue;

  //Save method by creating off screen graphics
  downloadcanvas = createGraphics(expandedWidth, expandedHeight);

  //Perform deep copy
  var expandedVerticesHashTableFlat = JSON.parse(JSON.stringify(triangulatedVerticesFlat));

  /*
  expandedVerticesHashTable = JSON.parse(JSON.stringify(verticesHashTable));

  for (p = 0; p < expandedVerticesHashTable.length; p++) {

    for (l = 0; l < expandedVerticesHashTable[p].length; l++) {
      var exv = expandVertex(expandedVerticesHashTable[p][l], mvalue);

      expandedVerticesHashTable[p][l] = exv;

    }
  }
  */

  for (var p = 0; p < expandedVerticesHashTableFlat.length; p++) {
    var exv = expandVertex(expandedVerticesHashTableFlat[p], mvalue);
    expandedVerticesHashTableFlat[p] = exv;
  }
  //verticesHashTableFlat = verticesHashTable.reduce(function(acc,curr){return acc.concat(curr)});
  downloadcanvas.noSmooth();
  for (j = 0; j < triangulations.length; j++) {
    delaunayDisplay(triangulations[j], downloadcanvas, expandedVerticesHashTableFlat);
  }

  if (save == true) {
    downloading = true;

    //Download canvas using file saver.js due to size restrictions.
    downloadcanvas.elt.id = "downloadthiscanvas";
    //image(downloadcanvas, 0, 0, cWidth, cHeight)
    var canvas = document.getElementById("downloadthiscanvas"),
      ctx = canvas.getContext("2d");
    // draw to canvas...
    canvas.toBlob(function (blob) {
      saveAs(blob, "PolyArt.png");
    });
    $("#downloadthiscanvas").remove();
    downloading = false;
    console.log("Finished downloading")
  }
  sd /= mvalue;
}
var testCanvas;
//Take the vertices and creates a flattend version
//Then uses the delaunator to produce the order in which the vertices are connected to get triangles.
function triangulize() {
  var delaunay;
  verticesHashTableFlat = verticesHashTable.reduce(function (acc, curr) {
    return acc.concat(curr)
  });
  delaunay = (Delaunator.from(verticesHashTableFlat))
  stepD = 0;

  var triangles = (delaunay.triangles)
  triangulations[0] = triangles;

  //displayPoints=false;
  //displayTriangulation=false;
  //displayPoints=true;
  displayTriangulation = true;
  css_buttons.displayTriangulation(true);
  stepD = 0;

  //Store the corresponding flat vertices for use by other functions
  triangulatedVerticesFlat = JSON.parse(JSON.stringify(verticesHashTableFlat));

}

//Get colors at x,y with pixel density (or resolution) d
function fget(x, y) {
  y = parseInt(y.toFixed(0));
  var off = ((y * d * cWidth + x) * d * 4);
  var components = [pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3]]
  return components;
}

function inCanvas(x, y) {
  if (x > cWidth || x < 0 || y > cHeight || y < 0) {
    return false;
  } else {
    return true;
  }
}

function sign(x1, y1, x2, y2, x3, y3) {
  return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
}

function pointInTriangle(x1, y1, x2, y2, x3, y3, x4, y4) {
  bc1 = sign(x4, y4, x1, y1, x2, y2) < 0;
  bc2 = sign(x4, y4, x2, y2, x3, y3) < 0;
  bc3 = sign(x4, y4, x3, y3, x1, y1) < 0;
  return ((bc1 == bc2) && (bc2 == bc3))
}
//Find average color in triangular region with accuracy as measured by pixels (best is accuracy=1)
function averageColor(x1, y1, x2, y2, x3, y3, accuracy) {
  var xs = [x1, x2, x3];
  var ys = [y1, y2, y3];
  var bx1 = xs.reduce(function (acc, curr) {
    return curr <= acc ? curr : acc
  })
  var bx2 = xs.reduce(function (acc, curr) {
    return curr >= acc ? curr : acc
  })
  var by1 = ys.reduce(function (acc, curr) {
    return curr <= acc ? curr : acc
  })
  var by2 = ys.reduce(function (acc, curr) {
    return curr >= acc ? curr : acc
  })
  if (quickColor == true) {
    return quickAverageColor(x1, y1, x2, y2, x3, y3);
  }
  var tr = 0;
  var tg = 0;
  var tb = 0;
  var totalSample = 0;
  for (i = 0; i < by2 - by1; i += accuracy) {
    for (j = 0; j < bx2 - bx1; j += accuracy) {
      if (pointInTriangle(x1, y1, x2, y2, x3, y3, bx1 + j, by1 + i)) {
        var tempColor = fget(bx1 + j, by1 + i)
        tr += tempColor[0];
        tg += tempColor[1];
        tb += tempColor[2];
        totalSample += 1;
      }
    }
  }
  if (totalSample == 0) {
    return quickAverageColor(x1, y1, x2, y2, x3, y3);
  }
  return [tr / totalSample, tg / totalSample, tb / totalSample]
}
//Takes color based on the color at the 3 vertices
function quickAverageColor(x1, y1, x2, y2, x3, y3) {
  var set1 = fget(x1, y1);
  var set2 = fget(x2, y2);
  var set3 = fget(x3, y3);
  var cR = (set1[0] + set2[0] + set3[0]) / 3;
  var cG = (set1[1] + set2[1] + set3[1]) / 3;
  var cB = (set1[2] + set2[2] + set3[2]) / 3;
  return [cR, cG, cB];
}

function squaredist(x1, y1, x2, y2) {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
}


//Constructor for buttons display functions
function construct_css_buttons() {
  this.displayPoints = function (a) {
    if (a === true) {
      $("#displayPoints").removeClass("active");
      $("#displayPoints").html("Hide<br>Points");
    } else {
      $("#displayPoints").addClass("active");
      $("#displayPoints").html("Show<br>Points");
    }
  }
  this.displayColor = function (a) {
    if (a === true) {
      $("#displayColor").removeClass("active");
      $("#displayColor").html("Hide<br>Colors");

    } else {
      $("#displayColor").html("Show<br>Colors");
      $("#displayColor").addClass("active");
    }
  }
  this.displayTriangulation = function (a) {
    if (a === true) {
      $("#displayTriangulation").html("Hide<br>Triangles<br>");
      $("#displayTriangulation").removeClass("active");
    } else {
      $("#displayTriangulation").html("Show<br>Triangles<br>");
      $("#displayTriangulation").addClass("active");
    }
  }
  this.displayImage = function (a) {
    if (a === true) {

      $("#displayImage").removeClass("active");
      $("#displayImage").html("Hide<br>Image");
    } else {
      $("#displayImage").html("Show<br>Image");
      $("#displayImage").addClass("active");
    }
  }

}
var css_buttons = new construct_css_buttons();


var maxStepBackDist = 0;
//max step back is how far u can undo, before you must stop or u might end up undoing to a different branch that was not overwritten yet
var indexPos = -1; //Index pos is essentially where we are currently going to write to data in storeVertices
var stepBackNum = 0;
var undoState = 0;
//Undostate = 0 means currently displaying an un-redoable layer
//Undostate = 1 means there are redos available. Also implies that if a new path is taken, we must remove the stored veritces up to indexPos - stepBackNum
//Store vertices up to 50 steps
function undo() {
  stepBackNum++;
  if (indexPos - stepBackNum <= 0 || stepBackNum >= max_undo - 1 || stepBackNum >= maxStepBackDist) {
    //console.log("disbaled")
    $("#undo").addClass("disabled");
    $("#undo").css("cursor", "not-allowed");
    $("#redo").removeClass("disabled");
    $("#redo").css("cursor", "pointer");
  } else {
    $("#undo").removeClass("disabled");
    $("#undo").css("cursor", "pointer");
    $("#redo").removeClass("disabled");
    $("#redo").css("cursor", "pointer");
  }

  if (indexPos - stepBackNum < 0 || stepBackNum > max_undo - 1 || stepBackNum > maxStepBackDist) {
    stepBackNum--;
    //can't undo anymore

    return;
  }

  undoState = 1;
  verticesHashTable = JSON.parse(JSON.stringify(storedVertices[(indexPos - stepBackNum) % max_undo][0]));
  totalpoints = storedVertices[(indexPos - stepBackNum) % max_undo][1];
  verticesHashTableFlat = verticesHashTable.reduce(function (acc, curr) {
    return acc.concat(curr)
  });


}

function redo() {
  stepBackNum--;
  if (stepBackNum <= 0) {
    $("#redo").addClass("disabled");
    $("#redo").css("cursor", "not-allowed");
    $("#undo").removeClass("disabled");
    $("#undo").css("cursor", "pointer");
  } else {
    $("#redo").removeClass("disabled");
    $("#redo").css("cursor", "pointer");
    $("#undo").removeClass("disabled");
    $("#undo").css("cursor", "pointer");
  }
  if (stepBackNum < 0) {
    stepBackNum++;
    undoState = 0;

    return;
  }

  verticesHashTable = JSON.parse(JSON.stringify(storedVertices[(indexPos - stepBackNum) % max_undo][0]));
  totalpoints = storedVertices[(indexPos - stepBackNum) % max_undo][1]
  verticesHashTableFlat = verticesHashTable.reduce(function (acc, curr) {
    return acc.concat(curr)
  });


}

function recordVertices() {
  if (undoState == 0) {
    indexPos++;

    storedVertices[indexPos % max_undo][0] = JSON.parse(JSON.stringify(verticesHashTable));
    storedVertices[indexPos % max_undo][1] = totalpoints;
    if (indexPos >= max_undo * 4) {
      //Don't let it get too big in case that one user spends forever (like very very long) time making poly art...
      indexPos = indexPos % max_undo + max_undo;
    }
    if (maxStepBackDist >= 50) {

    } else {
      maxStepBackDist++;
    }
    $("#undo").removeClass("disabled");
    $("#undo").css("cursor", "pointer");
    $("#redo").addClass("disabled");
    $("#redo").css("cursor", "not-allowed");

  } else {
    $("#redo").addClass("disabled");
    $("#redo").css("cursor", "not-allowed");
    $("#undo").removeClass("disabled");
    $("#undo").css("cursor", "pointer");
    //In the event that we start a new path during command z, we set indexPos at that current position
    indexPos = indexPos - stepBackNum;
    maxStepBackDist = max_undo - stepBackNum;
    stepBackNum = 0;
    undoState = 0;
    indexPos++;
    storedVertices[indexPos % max_undo][0] = JSON.parse(JSON.stringify(verticesHashTable));
    storedVertices[indexPos % max_undo][1] = totalpoints;
  }
  //console.log(storedVertices, indexPos, stepBackNum)
}
//Function for resizing the canvas at will of user

var origcWidth;
var origcHeight;
var canvasScale = 1;
function resize_poly_canvas(scale) {
  //!!!: We should always scale from original cWidth and cHeight next time
  //canvasScale += amount;
  
  cWidth = floor(cWidth * scale);
  cHeight = floor(cHeight * scale);
  
  /*
  cWidth = floor(origcWidth * canvasScale);
  cHeight = floor(origcHeight * canvasScale);
  */
  triangleCanvasLayer = createGraphics(cWidth, cHeight)
  
  resizeCanvas(cWidth,cHeight);
  
  //CSS, center canvas back to middle
  $("#gamedisplay").css("width", cWidth);
  $("#gamedisplay").css("margin-left", -cWidth/2);
  
  if (cWidth > 0.9 * window.innerWidth) {
    $("body").width(cWidth+100);
  }
  else {
    $("body").css("width","auto");
  }
  
  
  //Store the current vertices positions
  verticesHashTableFlat = verticesHashTable.reduce(function (acc, curr) {
    return acc.concat(curr)
  });
  var expandedVerticesHashTableFlat = JSON.parse(JSON.stringify(verticesHashTableFlat));
  
  //Regenerate hash space
  generateHashSpace();
  
  //Fill the hashspace up with the old vertices
  for (var p = 0; p < expandedVerticesHashTableFlat.length; p++) {
    var exv = expandVertex(expandedVerticesHashTableFlat[p], scale);
    expandedVerticesHashTableFlat[p] = exv;
    updateHashSpace(floor(exv[0]),floor(exv[1]),true);
  }
  //Set this as false, forcing the page to use the filters again to generate poly art. Otherwise, the displayed vertices won't be correct.
  completedFilters = false;
}