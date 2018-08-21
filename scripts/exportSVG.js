function exportSVG(data) {
  $(".main").append("<svg height=" + cHeight + " width=" + cWidth + ">" + data + "</svg>");
}
//Stroke Weight of one
function storeTrianglesToString() {
  var data = ""
  tng = triangulations[triangulations.length - 1];
  for (tInd = 0; tInd < tng.length; tInd += 3) {
    data += "<polygon points=\"" +
      verticesHashTableFlat[tng[tInd]][0] + "," +
      verticesHashTableFlat[tng[tInd]][1] + " " +
      verticesHashTableFlat[tng[tInd + 1]][0] + "," +
      verticesHashTableFlat[tng[tInd + 1]][1] + " " +
      verticesHashTableFlat[tng[tInd + 2]][0] + "," +
      verticesHashTableFlat[tng[tInd + 2]][1] + "\" ";
    //color
    hexcolors = rgbToHex(tColors[tInd].toFixed(0), tColors[tInd + 1].toFixed(0), tColors[tInd + 2].toFixed(0));
    data +=
      "style=\"fill:" + hexcolors +
      ";stroke:" + hexcolors + ";\"";
    data += "/>"
  }
  return data;
}
var hexletters = ['0', '1', '2', '3', '4', '5', '6', '7',
                  '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

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

function generateSVGFile(data, svgW, svgH) {
  var part1 = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>"

  var part2 = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">"
  var part3 =
    "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"" + svgW + "\" height=\"" + svgH + "\" viewBox=\"0 0 " + svgW + " " + svgH + "\" enable-background=\"new 0 0 " + svgW + " " + svgH + "\" xml:space=\"preserve\">"
  var part4 =
    "<g>" + data + "</g></svg>"
  return (part1 + part2 + part3 + part4)
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function downloadSVG(svgWidth, svgHeight) {
  var text = generateSVGFile(storeTrianglesToString(), svgWidth, svgHeight)
  //var filename = "PolyArt.svg";
  //download(filename, text);
  var svgblob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(svgblob, "PolyArt.svg");
}