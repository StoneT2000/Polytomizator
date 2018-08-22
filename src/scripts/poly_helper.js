//Create a hash out of the x,y coordinates
function hashCoordinate(x, y) {
  return floor(x / 50) * 100 + floor(y / 50);
}
//Find the index of the hashed value in the verticesHashTable array
function findIndexFromHash(hash) {
  var xi = floor((hash / 100));
  var yi = hash % 100;
  return xi + yi * ceil(cWidth / 50)
}

//Genearte verticesHashTable array, which is the array containing the coords of every vertice in a hashed array index.
function generateHashSpace() {
  verticesHashTable = [];
  //50x50 squares in grid
  for (i = 0; i <= ceil(cWidth / 50) * ceil(cHeight / 50); i++) {
    verticesHashTable.push([]);

  }
  for (i = 0; i < allVertices.length; i++) {

    var hashVal = hashCoordinate(allVertices[i][0], allVertices[i][1]);
    var index = findIndexFromHash(hashVal);
    verticesHashTable[index].push([allVertices[i][0], allVertices[i][1]])
  }
}

//Add or delete a vertex.
function updateHashSpace(x, y, add) {


  var hashVal = hashCoordinate(x, y);
  var index = findIndexFromHash(hashVal);
  if (add == true) {
    //console.log("x: " + x,"y: "+ y,"hashValue: " + hashVal, "index:" + index);
    verticesHashTable[index].push([x, y])
  }
  if (add == false) {
    //If deleting, we find the proper index, then proceed to search for that vertex with that coordinate and splice it
    for (i = 0; i < verticesHashTable[index].length; i++) {

      if (verticesHashTable[index][i][0] == x && verticesHashTable[index][i][1] == y) {
        verticesHashTable[index].splice(i, 1)
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
    triangulize();

    //Tell draw() to draw in colors once by setting this false. It will turn back to true once it is finished
    finishedColoring = false;

    //Load image
    image(img1, 0, 0, cWidth, cHeight);
    noColors = false;
    css_buttons.displayColor(true);

    //Load the pixels of said image
    loadPixels();

    //Reset the colors calculated
    tColors = [];

    sTime = millis();

    css_buttons.displayPoints(false);
    displayPoints = false;
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
    for (j = 0; j < triangulations.length; j++) {
      delaunayDisplay(triangulations[j], triangleCanvasLayer);

    }
  }
  //P
  else if (keyCode === 80) {
    mode = 1;
    $("#pointBrush").css("background-color", "RGB(140,140,140)")
    $("#lineBrush").css("background-color", "")
    $("#eraser").css("background-color", "")
    $("#triangleMover").css("background-color", "")

  }
  //E
  else if (keyCode === 69) {
    mode = 3;
    $("#eraser").css("background-color", "RGB(140,140,140)")
    $("#pointBrush").css("background-color", "")
    $("#lineBrush").css("background-color", "")
    $("#triangleMover").css("background-color", "")
  }
  //B
  else if (keyCode === 66) {
    mode = 2;
    $("#lineBrush").css("background-color", "RGB(140,140,140)")
    $("#pointBrush").css("background-color", "")
    $("#eraser").css("background-color", "")
    $("#triangleMover").css("background-color", "")
  }
  //T
  else if (keyCode === 84) {
    mode = 4;
    $("#triangleMover").css("background-color", "RGB(140,140,140)")
    $("#pointBrush").css("background-color", "")
    $("#lineBrush").css("background-color", "")
    $("#eraser").css("background-color", "")
  }
}

function mouseClicked() {
  //Check if click is within canvas
  if (active_canvas === true) {
    if (mouseX <= cWidth && mouseX >= 0) {
      if (mouseY <= cHeight && mouseY >= 0) {

        if (mode == 1) {
          var vpx = round(mouseX);
          var vpy = round(mouseY);
          if (snapping == true) {
            vpx = vpx - vpx % snappingAccuracy;
            vpy = vpy - vpy % snappingAccuracy;
          }
          if (unique_vertex(vpx, vpy)) {
            allVertices.push([vpx, vpy]);

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

        //verticesHashTableFlat = verticesHashTable.reduce(function(acc,curr){return acc.concat(curr)});

      }


    }
  }

}

//Broken
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
var sd = 5;
//Display all the triangles in tng. Displays them using the variable verticesarr = verticesHashTableFlat.
function delaunayDisplay(tng, ctx, vertices_set) {

  //we use triangulatedVerticesFlat as it is corresponding with tng
  var verticesarr = triangulatedVerticesFlat;
  if (vertices_set) {
    //Use this if we don't want to use verticesHashTableFlat directly
    verticesarr = vertices_set
  }

  for (var i = 0; i < tng.length; i += 3) {
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


      //Normal
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
  allVertices = dataStored[0];
  triangulations = dataStored[1];
  tColors = dataStored[2];
  verticesHashTable = dataStored[3];
  verticesHashTableFlat = dataStored[4];
  triangulize();



  displayPoints = true;
  css_buttons.displayPoints(true);
  for (j = 0; j < triangulations.length; j++) {
    delaunayDisplay(triangulations[j], triangleCanvasLayer);

  }
  recordVertices();
}

function saveData() {
  var currentData = [allVertices.slice(), triangulations.slice(), tColors.slice(), verticesHashTable.slice(), verticesHashTableFlat.slice()];
  localStorage.setItem("art1", JSON.stringify(currentData));

}

function expandVertex(vertex, expandValue) {
  if (expandValue < 1) {
    expandValue *= -1;
    expandValue = 1 / expandValue;
    expandValue++;
  } else {
    expandValue--;
  }
  var cx = 0;
  var ch = 0;
  var dx = vertex[0] - cx;
  var dy = vertex[1] - ch;
  return [vertex[0] + dx * (expandValue), vertex[1] + dy * (expandValue)];

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
    //console.log("Finished downloading")
  }
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

//Auto gen art based on filters
function autoGenerateArt() {
  if (completedFilters == false) {
    //checks if a filter has already been done
    completedFilters = true;
    image(img1, 0, 0, cWidth, cHeight);
    filter(GRAY);
    loadPixels();
    //console.log(pixels);
    pixels = changePixels3('smooth', pixels);
    pixels = changePixels3('edge', pixels);
  }
  allVertices = [];
  allVertices.push([0, 0]);
  allVertices.push([cWidth, 0]);
  allVertices.push([0, cHeight]);
  allVertices.push([cWidth, cHeight]);

  for (i = 0; i < cWidth / 80; i++) {
    var tempv = i * 80 + round(random(0, 30));
    var tempv2 = i * 80 + round(random(0, 30));
    if (inCanvas(tempv, cHeight)) {
      allVertices.push([tempv, cHeight])
    }
    if (inCanvas(tempv2, cHeight)) {
      allVertices.push([tempv2, 0])
    }


  }
  for (i = 0; i < cHeight / 80; i++) {
    var tempv = i * 80 + round(random(0, 30));
    var tempv2 = i * 80 + round(random(0, 30));
    if (inCanvas(cWidth, tempv)) {
      allVertices.push([cWidth, tempv])
    }
    if (inCanvas(0, tempv2)) {
      allVertices.push([0, tempv2])
    }

  }
  splitSquare(20)
  generateRandomSquares(20, 0.4)
  pushEdgePointsToAll();
  triangulize();

  finishedColoring = false;
  image(img1, 0, 0, cWidth, cHeight);

  loadPixels();
  tColors = [];
  css_buttons.displayPoints(false);
  displayPoints = false;
}

//Constructor for buttons display functions
function construct_css_buttons() {
  this.displayPoints = function (a) {
    if (a === false) {
      $("#displayPoints").html("Show<br>Points<br>");
      $("#displayPoints").css("color", "black");
      $("#displayPoints").css("background-color", "RGB(255,255,255)");
    } else {
      $("#displayPoints").html("Hide<br>Points<br>");
      $("#displayPoints").css("color", "white");
      $("#displayPoints").css("background-color", "RGB(40,40,40)");
    }
  }
  this.displayColor = function (a) {
    if (a === false) {
      $("#displayColor").html("Show<br>Colors<br>");
      $("#displayColor").css("color", "black");
      $("#displayColor").css("background-color", "RGB(255,255,255)");

    } else {
      $("#displayColor").html("Hide<br>Colors<br>");
      $("#displayColor").css("color", "white");
      $("#displayColor").css("background-color", "RGB(40,40,40)");
    }
  }
  this.displayTriangulation = function (a) {
    if (a === true) {
      $("#displayTriangulation").html("Hide<br>Triangles<br>");
      $("#displayTriangulation").css("color", "white");
      $("#displayTriangulation").css("background-color", "RGB(40,40,40)");
    } else {
      $("#displayTriangulation").html("Show<br>Triangles<br>");
      $("#displayTriangulation").css("color", "black");
      $("#displayTriangulation").css("background-color", "RGB(255,255,255)");
    }
  }
  this.displayImage = function (a) {
    if (a === true) {
      $("#displayImage").html("Hide<br>Image<br>");
      $("#displayImage").css("color", "white");
      $("#displayImage").css("background-color", "RGB(40,40,40)");
    } else {
      $("#displayImage").html("Show<br>Image<br>");
      $("#displayImage").css("color", "black");
      $("#displayImage").css("background-color", "RGB(255,255,255)");
    }
  }

}
var css_buttons = new construct_css_buttons();



var indexPos = -1;
var stepBackNum = 0;
var undoState = 0;
//Undostate = 0 means currently displaying an un-redoable layer
//Undostate = 1 means there are redos available. Also implies that if a new path is taken, we must remove the stored veritces up to indexPos - stepBackNum
//Store vertices up to 50 steps
function undo() {
  stepBackNum++;
  if (indexPos - stepBackNum < 0 || stepBackNum > max_undo - 1) {
    stepBackNum--;
    return;
  }
  undoState = 1;
  verticesHashTable = JSON.parse(JSON.stringify(storedVertices[(indexPos - stepBackNum) % max_undo]));
  verticesHashTableFlat = verticesHashTable.reduce(function (acc, curr) {
    return acc.concat(curr)
  });

  //console.log(storedVertices, indexPos, stepBackNum)

}

function redo() {
  stepBackNum--;
  if (stepBackNum < 0) {
    stepBackNum++;
    return;
  }
  verticesHashTable = JSON.parse(JSON.stringify(storedVertices[(indexPos - stepBackNum) % max_undo]));

  verticesHashTableFlat = verticesHashTable.reduce(function (acc, curr) {
    return acc.concat(curr)
  });
  //console.log(storedVertices, indexPos, stepBackNum)
}

function recordVertices() {
  if (undoState == 0) {
    indexPos++;

    storedVertices[indexPos % max_undo] = JSON.parse(JSON.stringify(verticesHashTable));

    if (indexPos >= max_undo * 4) {
      //Don't let it get too big in case that one user spends forever (like very very long) time making poly art...
      indexPos = indexPos % max_undo + max_undo;
    }

  } else {

    //In the event that we start a new path during command z, the new vertice is at indexPos = 1 now
    //With indexPos = 0 representing where we command z'd all the way to.
    //Thus, we set storedVertices[0] = to the canvas where we command z'd all the way to
    storedVertices[0] = JSON.parse(JSON.stringify(storedVertices[(indexPos - stepBackNum) % max_undo]));

    //storedVertices.splice(indexPos-stepBackNum+1);
    //indexPos = indexPos - stepBackNum;
    indexPos = 0;
    stepBackNum = 0;
    undoState = 0;
    indexPos++;
    storedVertices[indexPos % max_undo] = JSON.parse(JSON.stringify(verticesHashTable));
  }
  //console.log(storedVertices, indexPos, stepBackNum)
}