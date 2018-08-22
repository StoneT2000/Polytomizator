//This can only take even numbers at the moment.
function generateCubicPoly(accuracy, density, overlay) {
  var thisdensity = 0.5;
  if (density) {
    thisdensity = density;
  }
  if (!overlay) {
    verticesHashTable = [];

  }

  generateHashSpace();
  updateHashSpace(0, 0, true)
  updateHashSpace(cWidth, 0, true)
  updateHashSpace(0, cHeight, true)
  updateHashSpace(cWidth, cHeight, true)
  for (i = 0; i < cWidth / accuracy; i++) {
    updateHashSpace(i*accuracy, cHeight, true)
    updateHashSpace(i*accuracy, 0, true)

  }
  for (i = 0; i < cHeight / accuracy; i++) {
    updateHashSpace(cWidth, i * accuracy, true)
    updateHashSpace(0, i * accuracy, true);
  }
  
  flowing = false;
  if (flowerEffect === true){
    flower_step = 0;
    flowering = true;
  }
  
  image(img1, 0, 0, cWidth, cHeight);
  loadPixels();
  splitSquare(accuracy);
  scanSquareLR(accuracy, 100000000);
  image(img1, 0, 0, cWidth, cHeight);
  loadPixels();
  scanSquareUD(accuracy, 100000000);
  generateRandomSquares(accuracy, thisdensity)
  flowing = true;

  //generateHashSpace();
  triangulize();
  finishedColoring = false;
  image(img1, 0, 0, cWidth, cHeight);

  loadPixels();
  tColors = [];
  sTime = millis();
  css_buttons.displayPoints(false);
  displayPoints = false;
  recordVertices();

}

function splitSquare(accuracy) {
  colorOfSquares = [];
  image(img1, 0, 0, cWidth, cHeight);
  loadPixels();
  var cha = cHeight / accuracy;
  var cwa = cWidth / accuracy;
  for (ik = 0; ik < (cha); ik++) {
    for (jk = 0; jk < (cwa); jk++) {
      var tempSquareColor = averageColorSquare(jk * accuracy, ik * accuracy, accuracy, accuracy, 1)
      tempSquareColor.push(jk * accuracy, ik * accuracy)
      colorOfSquares.push(tempSquareColor)
    }

  }
}
//Average color under a square
function averageColorSquare(x1, y1, sw, sl, accuracy) {
  if (x1 + sl > cWidth) {
    sl = cWidth - x1;
  }
  if (y1 + sw > cHeight) {
    sw = cHeight - y1;
  }
  var tr = 0;
  var tg = 0;
  var tb = 0;
  var totalSample = 0;
  for (i = 0; i < sw; i += accuracy) {
    for (j = 0; j < sl; j += accuracy) {
      var tempColor = fget(x1 + j, y1 + i)
      tr += tempColor[0];
      tg += tempColor[1];
      tb += tempColor[2];
      totalSample += 1;
    }
  }
  return [tr / totalSample, tg / totalSample, tb / totalSample]
}

function scanSquareLR(accuracy, degree, degree2) {
  var deg2 = 800;
  if (degree2) {
    deg2 = degree2;
  }
  for (k = 0; k < colorOfSquares.length - 1; k++) {
    var tsc = colorOfSquares[k];
    var tsc2 = colorOfSquares[k + 1];
    var dr = tsc[0] - tsc2[0];
    var dg = tsc[1] - tsc2[1];
    var db = tsc[2] - tsc2[2];
    if (dr * dr + dg * dg + db * db > degree || dr * dr > deg2 || dg * dg > deg2 || db * db > deg2) {
      if (flowing == true) {
        var cr1 = round(random(-10, 10));
        var cr2 = round(random(-10, 10));
        if (inCanvas(tsc[3] + cr1 + accuracy, tsc[4] + cr2)) {
          updateHashSpace(tsc[3] + cr1 + accuracy / 2, tsc[4] + cr2, true);
        }
      } else {
        if (inCanvas(tsc[3] + accuracy / 2, tsc[4])) {
          updateHashSpace(tsc[3] + accuracy / 2, tsc[4], true);
        }
      }
    }
  }
  //generateHashSpace();
}

function scanSquareUD(accuracy, degree, degree2) {
  var deg2 = 800;
  if (degree2) {
    deg2 = degree2;
  }
  for (k = 0; k < colorOfSquares.length - ceil(cWidth / accuracy); k++) {
    var tsc = colorOfSquares[k];
    var tsc2 = colorOfSquares[k + ceil(cWidth / accuracy)];
    var dr = tsc[0] - tsc2[0];
    var dg = tsc[1] - tsc2[1];
    var db = tsc[2] - tsc2[2];
    if (dr * dr + dg * dg + db * db > degree || dr * dr > deg2 || dg * dg > deg2 || db * db > deg2) {
      if (flowing == true) {
        var cr1 = round(random(-10, 10));
        var cr2 = round(random(-10, 10));
        if (inCanvas(tsc[3] + cr1, tsc[4] + cr2 + accuracy / 2)) {
          updateHashSpace(tsc[3] + cr1, tsc[4] + cr2 + accuracy / 2, true)
        }
      } else {
        if (inCanvas(tsc[3], tsc[4] + accuracy / 2)) {
          updateHashSpace(tsc[3], tsc[4] + accuracy / 2, true);
        }
      }
    }
  }
  //generateHashSpace();
}

function generateRandomSquares(accuracy, density) {
  for (k = 0; k < colorOfSquares.length; k++) {
    var tsc = colorOfSquares[k];
    if (random(0, 1) <= density) {
      if (flowing == true) {
        var cr1 = round(random(-10, 10));
        var cr2 = round(random(-10, 10));
        if (inCanvas(tsc[3] + cr1, tsc[4] + cr2)) {
          updateHashSpace(tsc[3] + cr1, tsc[4] + cr2, true)
        }
      } else {
        if (inCanvas(tsc[3] + accuracy / 2, tsc[4])) {
          updateHashSpace(tsc[3] + accuracy / 2, tsc[4], true)
        }
      }


    }

  }
  //generateHashSpace();
}

function autoGenPoints(accuracy, density) {
  pDensity = 0.1
  if (density) {
    pDensity = density
  }
  splitSquare(accuracy);
  scanSquareLR(accuracy, 100000000);
  scanSquareUD(accuracy, 100000000);
  generateRandomSquares(accuracy, pDensity)
}
