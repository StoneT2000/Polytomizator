//Triangulations variable stores the order of the triangles vertices
var triangulations = [0];

//Colors of triangles
var tColors = [];

//Modes for different brushes
var mode = 1;

//Colors of all the squares generated by splitSquare(); Which is used to generate cubic poly art.
//Very quick and rudimentary method to detect edges
var colorOfSquares = [];

//Displaying booleans
var displayTriangulation = true;
var displayPoints = true;
var displayImage = true;
var display_grid = false;
var noColors = false; //Whether or not the colors, tColors, are used.

var flowing = true; //Flowing: true, points can be placed anywhere, when false, points are on fixed vertices. For cubic poly only.

var brushSize = 100; //Radius of brush


//Whether or not the current canvas is done coloring. Usually when it is not done, its usually due to the flower effect being turned on.
var finishedColoring = true;

//quick color is coloring that takes average RGB values at the three vertices of the triangles instead of the true average.
var quickColor = false;

//Calculating time statistics for coloring time
var sTime = 0;
var fTime = 0;

//Display squares created by generateCubicPoly.
var squares = false;
var colorAccuracy = 1;

//verticesHashTable(flat) are global variables edited by a bunch of functions
//Ultimately, triangulatedVerticesFlat (and triangulations) are used by delaunayDisplay function to display triangles
//verticesHashTable is used for quick calculations for things like erasers. It is also a real reflection of all the vertices in a canvas.
//verticesHashTableFlat is used for various other purposes, displaying vertices etc.
var verticesHashTable = [];
var verticesHashTableFlat = [];

//Total points/vertices on canvas
var totalpoints = 0;

//The below variable is used to store the vertices that correspond with the current triangulations array. It is basically what is downloaded. It is updated whenever triangulations is updated by triangulize();
var triangulatedVerticesFlat = [];

//Number of points drawn per stroke
var pointDensity = 4;

var flowerEffect = false; //Whether or not to have the flower effect
var filteringView = false; //Debugging purposes
var displayEdgePoints = false; //Display points whenusing filters
var snapping = false; //Snap points to a grid when using brushes

var snappingAccuracy = 20; //How big the squares in the grid are, relates with the positions of snapped on vertices.

//Testing different ways to display the information 
//displayMode = 0 is normal, 1:rectangles 2:circles 3:animated triangles 4: animated rectangles
var displayMode = 0;
var artstyle = 0; //0: Normal, 1: cubic, 2: ??


//Store past vertices placement
var storedVertices = [];
//Max number of undos allowed.
var max_undo = 50;

var myCanvas; //The canvas
var img1; //The current loaded image
var d; //Pixel density
var cWidth = 400; //canvas width
var cHeight = 400; //canvas height
var triangleCanvasLayer; //Off screen graphics layer for drawing triangles on

//active_canvas is when user is hovering over canvas
var active_canvas = false

var verticesCanvasLayer; //Off screen graphics layer for putting vertices on and off.


function setup() {
  
  
  img1 = createImage(1200, 800) //Default white background image
  d = pixelDensity(); //pixel density is important for screens with different resolutions (e.g old vs new macbooks)
  loadPixels();

  //Fix the height of the uploaded image based on height, it can't be too large
  var factor = img1.height / 620;
  cWidth = round(img1.width / factor);
  cHeight = round(img1.height / factor);
  if (cWidth > window.innerWidth * 0.9) {
    var factor = img1.width / (window.innerWidth * 0.9);
    cWidth = round(img1.width / factor);
    cHeight = round(img1.height / factor);
  }
  myCanvas = createCanvas(cWidth, cHeight);
  origcWidth = cWidth;
  origcHeight = cHeight;
  canvasScale = 1;
  //create off screen triangle generating layer
  triangleCanvasLayer = createGraphics(cWidth, cHeight);
  verticesCanvasLayer = createGraphics(cWidth, cHeight);
  //Initialize points on corners and sides

  generateHashSpace();

  //Initialize storedVertices array with 50 empty slots
  for (var slot_index = 0; slot_index < max_undo; slot_index++) {
    storedVertices.push([0,0]);
  }
  //Store empty vertices
  recordVertices();

  updateHashSpace(0, 0, true)
  updateHashSpace(cWidth, 0, true)
  updateHashSpace(0, cHeight, true)
  updateHashSpace(cWidth, cHeight, true)
  for (var i = 0; i < cWidth / 80; i++) {
    var tempv = i * 80 + round(random(0, 30));
    var tempv2 = i * 80 + round(random(0, 30));
    if (inCanvas(tempv, cHeight)) {
      updateHashSpace(tempv, cHeight, true)
    }
    if (inCanvas(tempv2, 0)) {
      updateHashSpace(tempv2, 0, true);
    }


  }
  for (var i = 0; i < cHeight / 80; i++) {
    var tempv = i * 80 + round(random(0, 30));
    var tempv2 = i * 80 + round(random(0, 30));
    if (inCanvas(cWidth, tempv)) {
      updateHashSpace(cWidth, tempv, true);
    }
    if (inCanvas(0, tempv2)) {
      updateHashSpace(0, tempv2, true);
    }


  }
  loadPixels();

  frameRate(60);

  //Disable anti-aliasing? Doesn't seem to work
  //noSmooth();



  //Store initial vertices
  recordVertices();
  verticesHashTableFlat = verticesHashTable.reduce(function (acc, curr) {
    return acc.concat(curr);
  });



  $("#gamedisplay").css("width", cWidth);
  $("#gamedisplay").css("margin-left", -cWidth/2);

  //Start up canvas
  myCanvas.parent('gamedisplay');
  
  //Change to degrees
  angleMode(DEGREES);
  
  //Attach listener to download SVG version of poly art.
  $("#downloadSVG").on("click", function () {
    if (finishedColoring === false) {
      alert("Please wait until the coloring is finished before enlargining the work and downloading it");
    } else if (triangulations[triangulations.length - 1].length > 0) {
      if (display_mode_on === true) {
        alert("At the moment, you can't download SVGs of the different display modes. Turn display mode off in settings to download SVG of the triangulation")
      } else {
        downloadSVG(cWidth, cHeight);
      }

    } else {
      alert("Make some poly art first");
    }
  });
  
  console.log("Finished Setting Up!");
  $("#loadingText").css("top", "30%");
  $("#loadingText").css("opacity", "0");
  $("#loadingScreen").css("opacity", "0");
  window.setTimeout(function () {
    $("#loadingScreen").css("z-index", "-10");

    $("#loadingText").html("Patience, we are making art <img src=\"images/loadingSymbol.gif\" style=\"margin-left: 10px\" width=\"32px\" height=\"auto\">");
  }, 1500);
  
  //Display default brush size and brush densities
  $("#brushSize")[0].value = brushSize;
  $("#brushDensity")[0].value = pointDensity + 1;

  //Detect when cursor is on the canvas
  $("#defaultCanvas0").on("mouseenter", function () {
    active_canvas = true;
  })
  $("#defaultCanvas0").on("mouseleave", function () {
    active_canvas = false;
  })
  
}
var accDist = 0;
var oldX = 0;
var oldY = 0;
var critDist = 10;

//Finds the colors for all triangles in the current triangulation
function colorIn() {
  image(img1, 0, 0, cWidth, cHeight);
  loadPixels();
  sTime = millis();
  for (var stepD1 = 0; stepD1 < triangulations[0].length - 1; stepD1 += 3) {
    //NOTE, this uses verticesHashTableFlat, not triangulatedVerticesFlat?
    var tAC = [0, 0, 0];

    tAC = averageColor(triangulatedVerticesFlat[triangulations[triangulations.length - 1][stepD1]][0], triangulatedVerticesFlat[triangulations[triangulations.length - 1][stepD1]][1], triangulatedVerticesFlat[triangulations[triangulations.length - 1][stepD1 + 1]][0], triangulatedVerticesFlat[triangulations[triangulations.length - 1][stepD1 + 1]][1], triangulatedVerticesFlat[triangulations[triangulations.length - 1][stepD1 + 2]][0], triangulatedVerticesFlat[triangulations[triangulations.length - 1][stepD1 + 2]][1], colorAccuracy);
    tColors.push(tAC[0], tAC[1], tAC[2]);

  }
  finishedColoring = true;
  fTime = millis();
  console.log("Coloring took:" + ((fTime - sTime) / 1000).toFixed(3) + " secs");
}
//Currently drawing flower effect?
var flowering = false;

//Step of flowering effect
var flower_step = 0;

//Speed of flowering effect
var flowering_speed = 1;

//Just to display the triangles without colors of triangulatedVerticesFlat
var uncoloredTriangleCanvasLayer;

function draw() {
  background("#FFFFFF");

  if (displayImage === true) {
    image(img1, 0, 0, cWidth, cHeight);
  }


  if (flowerEffect === true) {

    if (flowering === true) {
      delaunayDisplay(triangulations[0], triangleCanvasLayer, triangulatedVerticesFlat, true, flower_step, flowering_speed)
      flower_step += flowering_speed;
      if (flower_step + 1 > triangulations[0].length / 3) {
        flowering = false;
        fTime = millis();
        console.log("Coloring took:" + ((fTime - sTime) / 1000).toFixed(3) + " secs");
        flower_step = 0;
      }
    }


  } else {
    if (finishedColoring === false) {
      colorIn();
      finishedColoring = true;
      for (var j = 0; j < triangulations.length; j++) {
        delaunayDisplay(triangulations[j], triangleCanvasLayer);

      }
    }
  }

  stroke(2);

  //Display pixelated version of image
  if (colorOfSquares.length > 0 && squares === true) {
    noStroke();
    for (var i = 0; i < colorOfSquares.length; i++) {
      var tempSquareColor = colorOfSquares[i];
      fill(tempSquareColor[0], tempSquareColor[1], tempSquareColor[2]);
      rect(tempSquareColor[3], tempSquareColor[4], 20, 20);
    }
  }
  fill(256, 256, 256);


  if (displayTriangulation === true && finishedColoring === true) {
    if (flowerEffect === true && noColors === true) {
      //Thisis for the one case when the user selects to hide colors while flowering is in progress.
      image(uncoloredTriangleCanvasLayer, 0, 0);
    } else {
      image(triangleCanvasLayer, 0, 0);
    }
    //Each time an option is enacted, run through delaunayDisdplay to show that option
    //options such as hiding colors

  }


  fill(256, 256, 256);
  stroke(0, 0, 0);
  if (displayPoints === true) {
    for (var j = 0; j < verticesHashTable.length; j++) {
      //ellipse(verticesHashTableFlat[j][0], verticesHashTableFlat[j][1], 5, 5);

      for (var k = 0; k < verticesHashTable[j].length; k++) {
        //ellipse(verticesHashTable[j][k][0], verticesHashTable[j][k][1], 5, 5);
      }

    }
    image(verticesCanvasLayer, 0, 0);
  }
  if (display_grid === true) {
    strokeWeight(1);
    stroke(150);
    for (var j = 0; j < cWidth / snappingAccuracy; j++) {
      line(j * snappingAccuracy, 0, j * snappingAccuracy, cHeight);
    }
    for (var j = 0; j < cHeight / snappingAccuracy; j++) {
      line(0, j * snappingAccuracy, cWidth, j * snappingAccuracy);
    }
  }

  //Display the total number of points/vertices
  $("#numberPoints").text(totalpoints + " points");
  
  //Display total number of triangles
  var num_of_triangles_temp = parseInt(triangulations[triangulations.length - 1].length) / 3;
  if (!isNaN(num_of_triangles_temp)) {
    $("#numberTriangles").text(num_of_triangles_temp + " triangles");
  } else {
    $("#numberTriangles").text(0 + " triangles");
  }

  //Display the time it took to color the canvas
  if (finishedColoring === true) {
    $("#lastTiming").text(((fTime - sTime) / 1000).toFixed(3) + " seconds");
  }
  var dx = oldX - mouseX;
  var dy = oldY - mouseY;
  accDist = sqrt(dx * dx + dy * dy);
  if (mode === 2 && active_canvas) {

    noFill();
    stroke(200, 200, 200);
    ellipse(mouseX, mouseY, brushSize * 2, brushSize * 2);
    if (accDist >= critDist && mouseIsPressed) {


      if (mouseX > cWidth - 1 || mouseX < 1 || mouseY > cHeight - 1 || mouseY < 1) {} else {
        accDist = 0;
        critDist = random(15, 20);
        //accDist and critDist are used to make the brush not place a billion points at a time, and instead you have to move the brush in order to make more points.

        oldX = mouseX;
        oldY = mouseY;
        var vpx = (round(mouseX));
        var vpy = (round(mouseY));
        if (snapping === true) {
          vpx = vpx - vpx % snappingAccuracy;
          vpy = vpy - vpy % snappingAccuracy;
        }
        if (unique_vertex(vpx, vpy)) {
          updateHashSpace(vpx, vpy, true);

        }

        //Randomly generate points
        for (var l = 0; l < pointDensity; l++) {
          var r1 = random(-brushSize, brushSize);

          //Given r1, find the bounds of the y value of the vertex such that it is within the brush radius.
          var ybound = sqrt(brushSize * brushSize - r1 * r1);

          var r2 = random(-ybound, ybound);
          if (mouseX + r1 > cWidth - 1 || mouseX + r1 < 1 || mouseY + r2 > cHeight - 1 || mouseY + r2 < 1) {} else {
            var vpx = (round(mouseX + r1));
            var vpy = (round(mouseY + r2));
            if (snapping == true) {
              if (vpx % snappingAccuracy < snappingAccuracy / 2) {
                vpx = vpx - (vpx % snappingAccuracy)

              } else {
                vpx = vpx + snappingAccuracy - (vpx % snappingAccuracy)
              }
              if (vpy % snappingAccuracy < snappingAccuracy / 2) {
                vpy = vpy - (vpy % snappingAccuracy)
              } else {
                vpy = vpy + snappingAccuracy - (vpy % snappingAccuracy)
              }
            }
            if (unique_vertex(vpx, vpy)) {
              updateHashSpace(vpx, vpy, true);
            }

          }
        }
      }

    } else if (!mouseIsPressed) {
      //Allows u to use brush on same spot by clicking multiple times
      critDist = 0;
    }
  }

  //Erase points
  if (mode === 3 && active_canvas === true) {
    noFill();
    stroke(200, 200, 200);
    ellipse(mouseX, mouseY, brushSize * 2, brushSize * 2);
    if (mouseIsPressed) {
      var mx = mouseX
      var my = mouseY
      erase_vertices(mx, my, brushSize)
      //Look at indices at four corners + 5px
      var redraw_indices = [];
      var px1 = floor(round(mx) / hashing_size) * hashing_size;
      var py1 = floor(round(my) / hashing_size) * hashing_size;
      var eraser_index = findIndexFromHash(hashCoordinate(px1, py1));
      var redraw_indices = [];
      for (var t = -ceil(brushSize / hashing_size); t <= ceil(brushSize / hashing_size); t++) {
        for (var k = -ceil(brushSize / hashing_size); k <= ceil(brushSize / hashing_size); k++) {
          //Take some point, hashing_size multiple away from eraser, check if its in canvas still
          var cx1 = px1 + hashing_size * t;
          var cy1 = py1 + hashing_size * k;
          if (inCanvas(cx1, cy1)) {
            redraw_indices.push(findIndexFromHash(hashCoordinate(cx1, cy1)));
          }
        }
      }
      //console.log(redraw_indices);
      //THIS can be massively improved. The redraw indices can be shortened later. But in actual fact, the extra squares we search in the middle of the brush have no vertices anyway, so its good.
      for (var j = 0; j < redraw_indices.length; j++) {
        //Vertices to be redrawn
        var redraw_vertices = verticesHashTable[redraw_indices[j]];
        for (var k = 0; k < redraw_vertices.length; k++) {
          verticesCanvasLayer.ellipse(redraw_vertices[k][0], redraw_vertices[k][1], 5 ,5)
        }
      }

    }
  }

  if (filteringView === true) {
    pixels = filteredPixels;
    updatePixels();
  }
}

//Pixels[] array that has been filtered already
var filteredPixels = [];

//Of form [[x,y, brightness],[x,y, brightness],...]
var detected_edge_vertices = [];


function generate_normal_poly(values) {
  noLoop();
  $("#loadingScreen").css("z-index", "10");
  $("#loadingScreen").css("opacity", "1");
    $("#loadingText").css("top", "50%");
    $("#loadingText").css("opacity", "1");

  if (filteredPixels.length > 0 && completedFilters == true) {
    copyTo(filteredPixels, pixels);
  } else {
    image(img1, 0, 0, cWidth, cHeight);
    filter(GRAY);
    loadPixels();
  }
  if (flowerEffect === true) {
    flower_step = 0;
    flowering = true;
  }
  var artWorker = new Worker('scripts/webworkerArtGen.js')
  if (completedFilters == false) {
    var artWorkerstime = millis();
    detected_edge_vertices = [];
    artWorker.postMessage([[values[0], values[1]], pixels, values[2], values[3], values[4]])
    artWorker.onmessage = function (e) {
      var artResult = e.data;
      var artWorkerftime = millis();
      generateHashSpace();
      for (var iv = 0; iv < artResult[0].length; iv++) {
        updateHashSpace(artResult[0][iv][0], artResult[0][iv][1], true);
      }
      for (var iv = 0; iv < artResult[1].length; iv++) {
        //updateHashSpace(artResult[1][iv][0], artResult[1][iv][1], true);
        detected_edge_vertices.push([artResult[1][iv][0], artResult[1][iv][1], artResult[1][iv][2]]);
      }
      //console.log(values[0], values[1], artResult[1])
      
      
      
      for (var i = 0; i < detected_edge_vertices.length; i++) {
        if (detected_edge_vertices[i][2] >= colorThreshold) {
          //Randomly add
          if (random(0,1) > 0.5) {
            //Then randomly add jitter instead
            var ox = detected_edge_vertices[i][0];
            var oy = detected_edge_vertices[i][1];
            var random_num_jitter = random(0,1)*5 + 1;
            for (var ik = 0; ik < random_num_jitter; ik++){
              var vx = round(random(-jitter_deviation, jitter_deviation) + ox);
              var vy = round(random(-jitter_deviation, jitter_deviation) + oy);
              if (inCanvas(vx,vy)){
                updateHashSpace(vx,vy,true);
              }
            }
          }
          
          //updateHashSpace(detected_edge_vertices[i][0], detected_edge_vertices[i][1], true);
        }
      }


      copyTo(artResult[2], pixels)

      for (var km = 0; km < pixels.length; km++) {
        filteredPixels.push(pixels[km]);
      }
      splitSquare(20)
      generateRandomSquares(20, 0.4)

      //Then clean up the edge points

      triangulate_and_display();
      completedFilters = true;

      window.setTimeout(function () {
        $("#loadingScreen").css("opacity", "0");
        $("#loadingText").css("opacity", "0");
        $("#loadingText").css("top", "30%");
        window.setTimeout(function () {
          $("#loadingScreen").css("z-index", "-10");
        }, 1800);
      }, 0)
      loop();
      recordVertices();
      console.log("Webworker took " + ((artWorkerftime - artWorkerstime)/1000) + "s", "Area: " + (cWidth*cHeight));
    }
  } else {
    generateHashSpace()
    updateHashSpace(0, 0, true)
    updateHashSpace(cWidth, 0, true)
    updateHashSpace(0, cHeight, true)
    updateHashSpace(cWidth, cHeight, true)
    for (var i = 0; i < cWidth / 80; i++) {
      var tempv = i * 80 + Math.round(random(0, 30));
      var tempv2 = i * 80 + Math.round(random(0, 30));
      if (inCanvas(tempv, cHeight)) {
        updateHashSpace(tempv, cHeight, true)
      }
      if (inCanvas(tempv2, 0)) {
        updateHashSpace(tempv2, 0, true);
      }


    }
    for (var i = 0; i < cHeight / 80; i++) {
      var tempv = i * 80 + Math.round(random(0, 30));
      var tempv2 = i * 80 + Math.round(random(0, 30));
      if (inCanvas(cWidth, tempv)) {
        updateHashSpace(cWidth, tempv, true);
      }
      if (inCanvas(0, tempv2)) {
        updateHashSpace(0, tempv2, true);
      }


    }
    generateRandomSquares(30, 0.4)

    for (var i = 0; i < detected_edge_vertices.length; i++) {
      if (detected_edge_vertices[i][2] >= colorThreshold) {
        //Randomly add
        if (random(0,1) > jitter_prob) {
          //Then randomly add jitter instead
          var ox = detected_edge_vertices[i][0];
          var oy = detected_edge_vertices[i][1];
          var random_num_jitter = random(0,1)*max_jitter_count + 1;
          for (var ik = 0; ik < random_num_jitter; ik++){
            var vx = round(random(-jitter_deviation, jitter_deviation) + ox);
            var vy = round(random(-jitter_deviation, jitter_deviation) + oy);
            if (inCanvas(vx,vy)){
              updateHashSpace(vx,vy,true);
            }
          }
        }

        //updateHashSpace(detected_edge_vertices[i][0], detected_edge_vertices[i][1], true);
      }
    }


    //Then clean up the edge points a little.
    //Heuristic: if a very bright point has lots of points nearby, remove nearby ones, radius 10?

    triangulate_and_display();
    completedFilters = true;
    $("#loadingScreen").css("opacity", "0");
    $("#loadingText").css("opacity", "0");
    $("#loadingText").css("top", "30%");
    window.setTimeout(function () {
      $("#loadingScreen").css("z-index", "-10");
    }, 1500);
    loop();
    recordVertices();

  }
}
//Parameters for auto generating normal poly art.
var jitter_deviation = 20; //How far it can be from edge
var max_jitter_count = 3; //Max number of extra jitter points around edge point
var jitter_prob = 0.85; //Probability jitter is not added