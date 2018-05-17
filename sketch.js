//import Delaunator from 'delaunator';

var m1,m2,m3;
var vertices = [];//anchors for bezier
var curves = [];
var totalPointsOnCurve = [];
var bPoints = [];//Bezier points
var oPoints = [];//Other points created by bezier jitter
var allVertices=[];//allVertices list
var triangulations = [0];//the triangulations
var tColors = [];
var nPoints =[];//normal points
var mode = 0;//0: curves, 1: points, 2: drawing points tool
var previousData =[];
var dataPos = 0;
//BOOLS
var displayText = true;
var displayTriangulation = true;
var displayCurves =true;
var displayAnchors = true;
var displayPoints = true;
var displayImage = true;
var stepDelaunate = true;
var noColors = false;
var colorMap = false;
var flowing = true;
var brushSize = 10;
var magnification = 1; //Max canvas size is less than 9000
function preload(){
}
var myCanvas;
var img1;
var d;
function preload(){
  img1=loadImage("https://images.pexels.com/photos/270756/pexels-photo-270756.jpeg?w=940&h=650&auto=compress&cs=tinysrgb");
}
function setup(){
  
  d = pixelDensity();
  loadPixels();
  console.log(get(0,0));
  console.log(pixels);
  myCanvas =createCanvas(img1.width,img1.height);
  cWidth = img1.width;
  cHeight = img1.height;
  console.log(img1.width);
  
  allVertices.push([1,1]);
  allVertices.push([img1.width-1,1]);
  allVertices.push([1,img1.height-1]);
  allVertices.push([img1.width-1,img1.height-1]);
  //push vertices to edges
  
  for(i=0;i<img1.width/80;i++){
    allVertices.push([i*80+round(random(-30,30)),img1.height-1])
    allVertices.push([i*80+round(random(-30,30)),1])
  }
  for(i=0;i<img1.height/80;i++){
    allVertices.push([img1.width-1,i*80+round(random(-30,30))])
    allVertices.push([1,i*80+round(random(-30,30))])
  }
  
  $("#gamedisplay").css("right",(cWidth/2).toString()+"px")
  $("body").css("width",(cWidth+500).toString()+"px")
  $("body").css("height",(cHeight+400).toString()+"px")
  myCanvas.parent('gamedisplay');
  //noStroke();
  angleMode(DEGREES)
}
var accDist = 0;
var oldX=0;
var oldY=0;
var critDist = 10;
var stepD = 0;
var iterStep = 1;
function draw(){
  
  background("#FFFFFF")
  if (displayImage == true){
    image(img1,0,0);
  }
  //code to do progressive loading of triangles
  for (i=0;i<iterStep;i++){

    if (stepDelaunate == true && triangulations.length>0 && colorMap == true){
      //image(img1,0,0);
      if (stepD==0){
        loadPixels();
        tColors=[];
        $("#displayText").html("Show<br>Text<br>");
        $("#displayText").css("background-color","RGB(100,100,100)");
        $("#displayAnchors").html("Show<br>Anchors<br>");
        $("#displayAnchors").css("background-color","RGB(100,100,100)");
        $("#displayPoints").html("Show<br>Points<br>");
        $("#displayPoints").css("background-color","RGB(100,100,100)");
        $("#displayCurves").html("Show<br>Curves<br>");
        $("#displayCurves").css("background-color","RGB(100,100,100)");

      }
      else if (stepD>=triangulations[triangulations.length-1].length){
       
      }
      var triangles = triangulations[triangulations.length-1];
      if (stepD<triangulations[triangulations.length-1].length){
        displayText=false;
        displayCurves=false;
        displayPoints=false;
        displayAnchors=false;
        
        var set1 = fget(allVertices[triangles[stepD]][0],allVertices[triangles[stepD]][1]);
        var set2 = fget(allVertices[triangles[stepD+1]][0],allVertices[triangles[stepD+1]][1]);
        var set3 = fget(allVertices[triangles[stepD+2]][0],allVertices[triangles[stepD+2]][1]);

        //console.log(allVertices[triangles[stepD]][0],allVertices[triangles[stepD]][1])
        //var ta = allVertices[triangles[stepD]][0];
        //var tb = allVertices[triangles[stepD]][1];
        var cR=(set1[0]+set2[0]+set3[0])/3;
        var cG=(set1[1]+set2[1]+set3[1])/3;
        var cB=(set1[2]+set2[2]+set3[2])/3;
        tColors.push(cR,cG,cB);

      }

      stepD+=3;
    }
  }
  stroke(2);

  fill(256,256,256)
  if (displayTriangulation == true){
    for (j=0;j<triangulations.length;j++){
      delaunayDisplay(triangulations[j]);
    }
  }
  fill(256,256,256)
  stroke(0,0,0)
  if (displayAnchors == true){
    for (k=0;k<vertices.length;k++){
      ellipse(vertices[k][0],vertices[k][1],10,10)
    }
    for (j=0;j<currSetPt.length;j++){
      ellipse(currSetPt[j][0],currSetPt[j][1],10,10)
    }
  }
  if (displayCurves == true){
    for (j=0;j<curves.length;j++){
      noFill();
      curveDisplay(curves[j],j)
    }
  }
  if (displayPoints == true){
    for (j=0;j<bPoints.length;j++){
      strokeWeight(1);
      fill(256,256,256)
      ellipse(bPoints[j][0],bPoints[j][1],5,5)

    }
    for (j=0;j<oPoints.length;j++){
      ellipse(oPoints[j][0],oPoints[j][1],5,5)
    }
    for (j=0;j<nPoints.length;j++){
      ellipse(nPoints[j][0],nPoints[j][1],5,5)
    }
  }
  

  //Texts
  if (displayText == true){
    var accum = 0;
    //accum is just so we can determine which bPoint is part of which curve
    for (i=0;i<curves.length;i++){
      accum += totalPointsOnCurve[i];
      textSize(20);
      noStroke();
      fill(256,256,256)
      text("Curve: " + (i+1),bPoints[accum-floor(totalPointsOnCurve[i]/2)][0],bPoints[accum-floor(totalPointsOnCurve[i]/2)][1])
    }
  }
  
  //code for random brushes
  var dx=oldX-mouseX;
  var dy=oldY-mouseY;
  accDist = sqrt(dx*dx+dy*dy)
  if (mode==2 && accDist>=critDist && mouseIsPressed){

    if (mouseX>cWidth-1 || mouseX<1 || mouseY >cHeight-1 || mouseY<1){
    }
    else {
      accDist =0;
      //store old pos.
      critDist = random(15,20)
      oldX=mouseX;
      oldY=mouseY;
      allVertices.push([round(mouseX),round(mouseY)]);
      
      nPoints.push([round(mouseX),round(mouseY)]);
      for (i=0;i<2;i++){
        var r1=random(-brushSize,brushSize)
        var r2=random(-brushSize,brushSize);
        if (mouseX+r1>cWidth-1 || mouseX+r1<1 || mouseY+r2 >cHeight-1 || mouseY+r2<1){
        }
        else{
          allVertices.push([round(mouseX+r1),round(mouseY+r2)]);
        nPoints.push([round(mouseX+r1),round(mouseY+r2)]);
        }
      }
    }

  }
  
  
}
function keyPressed(){
  if (keyCode === 32) {
    saveCanvas(myCanvas, 'myCanvas', 'jpg');
  }
  else if (keyCode === 13){
    //pressing enter pushes current set of points from curve
    for (i=0;i<currSetPt.length;i++){
      vertices.push(currSetPt[i]);
    }
    //console.log(currSetPt);
    produceJitterPt(currSetPt);
    //then produce bezier curve based points with jitter
    currSetPt = [];
  
  }
  //click "d" to produce triangulated image
  else if (keyCode===68){

    //perhaps just find all vertices near the new points, and delaunate it
    var delaunay;
    //console.log(vertices)
    //allVertices=[[0,0],[100,100],[200,100]]
    delaunay = (Delaunator.from(allVertices))
    triangles = (delaunay.triangles)
    //console.log(triangles)
    //fill(256,256,256)
    
    //triangulations.push(triangles);
    //If we have the functionality to onyl recalculate a part at a time, then use push, otherwise
    triangulations[0] = triangles;
    
    //var coordinates = [];
    //sort out the colors:
    displayText=false;
    displayCurves=false;
    displayPoints=false;
    displayAnchors=false;
    image(img1,0,0)
    //tColors = [];
    if (stepDelaunate == false){
      for (var i = 0; i < triangles.length; i += 3) {

        
        var set1 = fget(allVertices[triangles[i]][0],allVertices[triangles[i]][1]);
        var set2 = fget(allVertices[triangles[i+1]][0],allVertices[triangles[i+1]][1]);
        var set3 = fget(allVertices[triangles[i+2]][0],allVertices[triangles[i+2]][1]);
        //console.log(allVertices[triangles[i]][0],allVertices[triangles[i]][1])
        //var ta = allVertices[triangles[i]][0];
        //var tb = allVertices[triangles[i]][1];
        var cR=(set1[0]+set2[0]+set3[0])/3;
        var cG=(set1[1]+set2[1]+set3[1])/3;
        var cB=(set1[2]+set2[2]+set3[2])/3;
        tColors.push(cR,cG,cB);
      }
    }
    displayText=true;
    displayCurves=true;
    displayPoints=true;
    displayAnchors=true;
    stepD = 0;
    
  }
  //"\" change paint mode
  else if (keyCode===220){

    if (mode==0){
      mode =1;
      console.log("point mode")
    }
    else if (mode==1){
      mode=2;
      console.log("line mode")
    }
    else {
      mode = 0;
      console.log("curves mode")
    }
  }
  //pressing "C" displays colors
  else if (keyCode===67){
    
    if (noColors == false){
      noColors = true;
      
    }
    else {
      noColors = false;
    }
  }
  //pressing "M" shortcut, stops or continues coloring
  else if (keyCode===77){
    
    if (colorMap == false){
      colorMap = true;
      $("#colorMap").text("Coloring Map: On (Press M to switch)")
    }
    else {
      colorMap = false;
      $("#colorMap").text("Coloring Map: Off (Press M to switch)")
    }
  }
  else if (/*(keyCode === 224 || keyCode===91)*/ keyCode===90){
    //comannd Z!

    if (dataPos>0){
      dataPos--;
      //console.log(dataPos)
      loadData(previousData[dataPos])
      //console.log(previousData.slice())
    }
    
  }
  else if (keyCode===80){
    
      
    
    
  }
}
var currSetPt = [];
function mouseClicked(){

  if (mouseX<=cWidth && mouseX>=0){
    if(mouseY<=cHeight && mouseY>=0){
      if (mode==0){
        currSetPt.push([round(mouseX),round(mouseY)])
      }
      if (mode == 1){
        allVertices.push([round(mouseX),round(mouseY)]);
        nPoints.push([round(mouseX),round(mouseY)]);
      }
      if (mode==2){
        
      }
      if (dataPos < previousData.length-1){
        //console.log("redo",dataPos,previousData.length-1)
        previousData.splice(dataPos+1,previousData.length-1-dataPos);
        //console.log(previousData.slice())
      }
      previousData.push([vertices.slice(),curves.slice(),totalPointsOnCurve.slice(),bPoints.slice(),oPoints.slice(),allVertices.slice(),triangulations.slice(),tColors.slice(),nPoints.slice(),currSetPt.slice()]);
      
      
      dataPos=previousData.length-1;
      //console.log(dataPos);
      
    }
  }
  
  
}
function produceJitterPt(verticesSet){
  //first flatten array
  var flatV= verticesSet.reduce((acc,curr)=> acc.concat(curr));
  curves.push(flatV);
  //console.log(curves[curves.length-1])
  var total = 5;
  //can be reset somewhere
  totalPointsOnCurve.push(total);
  for (m=0;m<=total;m++){
    var t=m/total;
    var bx=round(bezierPoint(flatV[0],flatV[2],flatV[4],flatV[6],t))
    var by=round(bezierPoint(flatV[1],flatV[3],flatV[5],flatV[7],t));
    bPoints.push([bx,by]);

    //jittered.push([bx-round(random(10,100)),by-round(random(10,100))])
    //uncomment below to add traignels connecting to curve
    allVertices.push(bPoints[bPoints.length-1]);
    
    var tx = bezierTangent(flatV[0],flatV[2],flatV[4],flatV[6],t);
    var ty = bezierTangent(flatV[1],flatV[3],flatV[5],flatV[7],t);
    // Calculate an angle from the tangent points
    
    var a = atan2(ty, tx);
    a-=HALF_PI
    //line(bx, by, cos(a) * 30 + bx, sin(a) * 30 + by);
    var jitterAmount = 3;
    var randomAmount = 100;
    //tailling effects? By reducing probbility of jitter
    for (ci=1;ci<=jitterAmount;ci++){
      if (ci/random(1,jitterAmount+0.1) <=1){
        var cx = cos(a)*30*ci 
        var nx= round(cx+ bx+random(-randomAmount,randomAmount))
        var cy= sin(a)*30*ci 
        var ny= round(cy+ by+random(-randomAmount,randomAmount))
        if (nx > cWidth-1 || nx<1 || ny>cHeight-1||ny<1){
          
        }
        else {
          oPoints.push([nx,ny])
          allVertices.push(oPoints[oPoints.length-1]);
        }
        cx*=-1;
        nx= round(cx+ bx+random(-randomAmount,randomAmount))
        cy*=-1;
        ny= round(cy+ by+random(-randomAmount,randomAmount))
        if (nx >= cWidth-1 || nx<1 || ny>=cHeight-1||ny<1){
          
        }
        else {
          oPoints.push([nx,ny])
          allVertices.push(oPoints[oPoints.length-1]);
        }
        //look at delaunay.hull
        //Add option to have no specific hull
      }
    }
  }
  
}
function curveDisplay(coords,i){
  bezier(coords[0],coords[1],coords[2],coords[3],coords[4],coords[5],coords[6],coords[7]);
  
}
function delaunayDisplay(tng){
  for (var i = 0; i < tng.length; i += 3) {

    if (tColors[i]>=0 && noColors == false){
      
      fill(tColors[i],tColors[i+1],tColors[i+2]);
      stroke(tColors[i],tColors[i+1],tColors[i+2]);
      //store color data later
      
    }
    else if (noColors == true){
      fill(256,256,256);
      stroke(10,10,10);
    }
    else {
      fill(256,256,256);
      stroke(10,10,10);
    }
    var eX=[0,0],eY=[0,0],eZ=[0,0];

    triangle(allVertices[tng[i]][0]+eX[0],allVertices[tng[i]][1]+eX[1],allVertices[tng[i+1]][0]+eY[0],allVertices[tng[i+1]][1]+eY[1],allVertices[tng[i+2]][0]+eZ[0],allVertices[tng[i+2]][1]+eZ[1]);
  }
}
function loadData(dataStored){

  vertices=dataStored[0];
  curves=dataStored[1];
  totalPointsOnCurve=dataStored[2];
  bPoints=dataStored[3];
  oPoints=dataStored[4];
  allVertices=dataStored[5];
  triangulations=dataStored[6];
  tColors=dataStored[7];
  nPoints=dataStored[8];
  currSetPt=dataStored[9];
}
function saveData(){
  var currentData = [vertices.slice(),curves.slice(),totalPointsOnCurve.slice(),bPoints.slice(),oPoints.slice(),allVertices.slice(),triangulations.slice(),tColors.slice(),nPoints.slice(),currSetPt.slice()];
  localStorage.setItem("art1",JSON.stringify(currentData));

}
function expandVertex(vertex,expandValue){
  //expands the point outward somewhere depending on initial positon
  if (expandValue<1){
    expandValue*=-1;
    expandValue = 1/expandValue;
    expandValue++;
  }
  else{
    expandValue--;
  }
  var cx=1;
  var ch=1;
  var dx=vertex[0]-cx;
  var dy=vertex[1]-ch;
  //console.log(vertex[0]+dx*expandValue);
  return [vertex[0]+dx*(expandValue),vertex[1]+dy*(expandValue)];
  
}
function lineAngle(x1,y1,x2,y2){
  if (x2-x1 >= 0){
    var angleconstant = 0;
    if (y2-y1 >= 0){
      angleconstant = 360;
    }
  }
  else {
    var angleconstant = 180;
  }
  return -atan((y2-y1)/(x2-x1)) + angleconstant;
}
function expandImage(mvalue){
    myCanvas =createCanvas(cWidth*mvalue,cHeight*mvalue);
    cWidth = cWidth*mvalue;
    cHeight = cHeight*mvalue;
    $("#gamedisplay").css("right",(cWidth/2).toString()+"px")
    $("body").css("width",(cWidth+500).toString()+"px")
    $("body").css("height",(cHeight+400).toString()+"px")
    myCanvas.parent('gamedisplay');
    for (p=0;p<allVertices.length;p++){
      var tempV = expandVertex(allVertices[p],mvalue)
      allVertices[p] = tempV;
    }
    //search through one of previous data, the current canvas
    for (k=0;k<previousData[previousData.length-1].length;k++){
      if (k!=1 && k!=2 && k!=5 && k!=6 && k!=7){
        //for each part of the previous data that is expandable, e.g the vertices, expand it
        for (t=0;t<previousData[previousData.length-1][k].length;t++){
          var tempV = expandVertex(previousData[previousData.length-1][k][t],mvalue);
          previousData[previousData.length-1][k][t]=tempV;
        }
      }
    }
}
function fget(x,y){
  y=parseInt(y.toFixed(0));
  var off = ((y*img1.width + x)*d*4);
  var components = [ pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3] ]
  return components;
}
function scanLR(data,degree,accuracy){
  //image data is the pixels
  for (j=0;j<img1.height-accuracy;j+=accuracy){
    for (i=0;i<img1.width-accuracy;i+=accuracy){
      var c1=fget(i,j);
      var c2=fget(i+1,j);
      var dr = c1[0]-c2[0]
      var dg = c1[1]-c2[1]
      var db = c1[2]-c2[2]
      var da = c1[3]-c2[3]
      //console.log(i,j)
      if (dr*dr+dg*dg+db*db+da*da > degree){
        nPoints.push([i,j]);
        allVertices.push([i,j]);
        if (flowing == true){
          for (ij=0;ij<2;ij++){
            var cr1=round(random(-10,10));
            var cr2=round(random(-10,10));
            if (i+cr1 > cWidth-1 || i+cr1<1 || j+cr2>cHeight-1||j+cr2<1){
          
            }  
            else {
              nPoints.push([i+cr1,j+cr2]);
              allVertices.push([i+cr1,j+cr2]);
            }
          }
          
        }
      }
    }
  }
}
