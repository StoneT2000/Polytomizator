function exportSVG(data){
  $(".main").append("<svg height="+cHeight + " width=" +cWidth+">"+ data+"</svg>");
}
//Stroke Weight of one
function storeTrianglesToString(){
  var data = ""
  tng=triangulations[triangulations.length-1];
  for (tInd =0; tInd<tng.length;tInd+=3){
    data += "<polygon points=\"" +
      verticesHashTableFlat[tng[tInd]][0]+","+
      verticesHashTableFlat[tng[tInd]][1]+" "+
      verticesHashTableFlat[tng[tInd+1]][0]+","+
      verticesHashTableFlat[tng[tInd+1]][1]+" "+
      verticesHashTableFlat[tng[tInd+2]][0]+","+
      verticesHashTableFlat[tng[tInd+2]][1]+"\" ";
    //color
    data+=
      "style=\"fill:RGB(" + tColors[tInd].toFixed(0) + "," + tColors[tInd+1].toFixed(0) +","+tColors[tInd+2].toFixed(0)+
      ");stroke:RGB("+tColors[tInd].toFixed(0) + "," + tColors[tInd+1].toFixed(0) +","+tColors[tInd+2].toFixed(0)+");\"";
    data+="/>"
  }
  return data;
}

function generateSVGFile(data,svgW,svgH){
  var part1 = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>"
  
  var part2 = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">"
  var part3 =
      "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+svgW+"\" height=\""+svgH+"\">"
  var part4 = 
      "<g>"+data+"</g></svg>"
  return (part1+part2+part3+part4)
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
function downloadSVG(svgWidth,svgHeight){
    var text = generateSVGFile(storeTrianglesToString(),svgWidth,svgHeight)
    var filename = "PolyArt.svg";
    download(filename, text);
}
