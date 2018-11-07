//store all the triangle and color data into <polygon> tags suitable for svg exporting.

function storeTrianglesToString() {
  var data = ""
  tng = triangulations[triangulations.length - 1];
  for (var tInd = 0; tInd < tng.length; tInd += 3) {
    data += "<polygon points=\"" +
      triangulatedVerticesFlat[tng[tInd]][0] + "," +
      triangulatedVerticesFlat[tng[tInd]][1] + " " +
      triangulatedVerticesFlat[tng[tInd + 1]][0] + "," +
      triangulatedVerticesFlat[tng[tInd + 1]][1] + " " +
      triangulatedVerticesFlat[tng[tInd + 2]][0] + "," +
      triangulatedVerticesFlat[tng[tInd + 2]][1] + "\" ";

    hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
    data +=
      "style=\"fill:" + hexcolors +
      ";stroke:" + hexcolors + ";\"";
    data += "/>"
  }
  return data;
}

function storeLinesToString() {
  var data = ""
  tng = triangulations[triangulations.length - 1];
  for (var tInd = 0; tInd < tng.length; tInd += 3) {
    var x1 = triangulatedVerticesFlat[tng[tInd]][0];
    var x2 = triangulatedVerticesFlat[tng[tInd + 1]][0];
    var x3 = triangulatedVerticesFlat[tng[tInd + 2]][0];
    var y1 = triangulatedVerticesFlat[tng[tInd]][1];
    var y2 = triangulatedVerticesFlat[tng[tInd + 1]][1];
    var y3 = triangulatedVerticesFlat[tng[tInd + 2]][1];
    data += "<line x1='" + x1 + "' y1='" +
      y1 + "' x2='" +
      x2 + "' y2='" +
      y2 + "' stroke-width='1' ";

    hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
    data +=
      "style=\"fill:" + hexcolors +
      ";stroke:" + hexcolors + ";\"";
    data += "/>"
    data += "<line x1='" + x2 + "' y1='" +
      y2 + "' x2='" +
      x3 + "' y2='" +
      y3 + "' stroke-width='1' ";

    hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
    data +=
      "style=\"fill:" + hexcolors +
      ";stroke:" + hexcolors + ";\"";
    data += "/>"
    data += "<line x1='" + x3 + "' y1='" +
      y3 + "' x2='" +
      x1 + "' y2='" +
      y1 + "' stroke-width='1' ";

    hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
    data +=
      "style=\"fill:" + hexcolors +
      ";stroke:" + hexcolors + ";\"";
    data += "/>"
  }
  return data;
}
function storeDisconnectLinesToString() {
  var data = ""
  tng = triangulations[triangulations.length - 1];
  for (var tInd = 0; tInd < tng.length; tInd += 3) {
    var x1 = triangulatedVerticesFlat[tng[tInd]][0];
    var x2 = triangulatedVerticesFlat[tng[tInd + 1]][0];
    var x3 = triangulatedVerticesFlat[tng[tInd + 2]][0];
    var y1 = triangulatedVerticesFlat[tng[tInd]][1];
    var y2 = triangulatedVerticesFlat[tng[tInd + 1]][1];
    var y3 = triangulatedVerticesFlat[tng[tInd + 2]][1];
    var prob = Math.random();
    if (prob < 0.33){
      data += "<line x1='" + x1 + "' y1='" +
        y1 + "' x2='" +
        x2 + "' y2='" +
        y2 + "' stroke-width='1' ";

      hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
      data +=
        "style=\"fill:" + hexcolors +
        ";stroke:" + hexcolors + ";\"";
      data += "/>"
    }
    else if (prob < 0.66){
      data += "<line x1='" + x2 + "' y1='" +
        y2 + "' x2='" +
        x3 + "' y2='" +
        y3 + "' stroke-width='1' ";

      hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
      data +=
        "style=\"fill:" + hexcolors +
        ";stroke:" + hexcolors + ";\"";
      data += "/>"
    }
    else {
      data += "<line x1='" + x3 + "' y1='" +
        y3 + "' x2='" +
        x1 + "' y2='" +
        y1 + "' stroke-width='1' ";

      hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
      data +=
        "style=\"fill:" + hexcolors +
        ";stroke:" + hexcolors + ";\"";
      data += "/>"
    }
  }
  return data;
}
var hexletters = ['0', '1', '2', '3', '4', '5', '6', '7',
                  '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

//convert rgb to hexadecimal values
function rgbToHex(r, g, b) {
  var r1 = r % 16;
  var g1 = g % 16;
  var b1 = b % 16;
  var rt = (r - r1) / 16;
  var gt = (g - g1) / 16;
  var bt = (b - b1) / 16;
  var d1 = hexletters[rt] + hexletters[r1];
  var d2 = hexletters[gt] + hexletters[g1];
  var d3 = hexletters[bt] + hexletters[b1];
  return "#" + d1 + d2 + d3;
}
//Generate SVG formatting with the triangle data and canvas size data
function generateSVGFile(data, svgW, svgH) {
  var part1 = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>"

  var part2 = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">"
  var part3 =
    "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"" + svgW + "\" height=\"" + svgH + "\" viewBox=\"0 0 " + svgW + " " + svgH + "\" enable-background=\"new 0 0 " + svgW + " " + svgH + "\" xml:space=\"preserve\">"
  var part4 =
    "<g>" + data + "</g></svg>"
  return (part1 + part2 + part3 + part4)
}

//Send request to download SVG to browser.
function downloadSVG(svgWidth, svgHeight) {
  var text = generateSVGFile(storeTrianglesToString(), svgWidth, svgHeight)
  //var filename = "PolyArt.svg";
  var svgblob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(svgblob, "PolyArt.svg");
}
function downloadSVGLines(svgWidth, svgHeight) {
  var text = generateSVGFile(storeLinesToString(), svgWidth, svgHeight)
  //var filename = "PolyArt.svg";
  var svgblob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(svgblob, "PolyArtLines.svg");
}
function downloadSVGDisconnectedLines(svgWidth, svgHeight) {
  var text = generateSVGFile(storeDisconnectLinesToString(), svgWidth, svgHeight)
  //var filename = "PolyArt.svg";
  var svgblob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(svgblob, "PolyArtLines.svg");
}