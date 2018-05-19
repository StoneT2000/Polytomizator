var vertices = [];
var curves = [];
var totalPointsOnCurve = [];
var bPoints = [];
var oPoints = [];
var allVertices=[];
var triangulations = [0];
var tColors = [];
var nPoints =[];
var mode = 1;
var previousData =[];
var dataPos = 0;
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
var magnification = 1;
var finishedColoring = false;
var quickColor = false;
var sTime = 0;
var fTime = 0;
var colorAccuracy = 1;
var workTriangles=[];
function preload(){
}
var myCanvas;
var img1;
var d;
function preload(){
  img1=loadImage("images/m10.jpg");
}
function setup(){
  
  d = pixelDensity();
  loadPixels();
  cWidth = img1.width;
  cHeight = img1.height;
  myCanvas =createCanvas(cWidth,cHeight);
  
  
  allVertices.push([0,0]);
  allVertices.push([cWidth-1,0]);
  allVertices.push([0,cHeight-1]);
  allVertices.push([cWidth-1,cHeight-1]);
  
  for(i=0;i<cWidth/80;i++){
    var tempv = i*80+round(random(0,30));
    var tempv2 = i*80+round(random(0,30));
    if (inCanvas(tempv,cHeight-1)){
      allVertices.push([i*80+round(random(0,30))-1,cHeight-1])
    }
    if (inCanvas(tempv,cHeight-1)){
      allVertices.push([i*80+round(random(0,30))-1,0])
    }
        
        
  }
  for(i=0;i<cHeight/80;i++){
    var tempv = i*80+round(random(0,30));
    var tempv2 = i*80+round(random(0,30));
    if (inCanvas(cWidth-1,tempv)){
      allVertices.push([cWidth-1,i*80+round(random(0,30))-1])
    }
    if (inCanvas(0,tempv2)){
      allVertices.push([0,i*80+round(random(0,30))-1])
    }


  }
  
  $("#gamedisplay").css("right",(cWidth/2).toString()+"px")
  $("body").css("width",(cWidth+500).toString()+"px")
  $("body").css("height",(cHeight+400).toString()+"px")
  myCanvas.parent('gamedisplay');
  angleMode(DEGREES)
  previousData.push([vertices.slice(),curves.slice(),totalPointsOnCurve.slice(),bPoints.slice(),oPoints.slice(),allVertices.slice(),triangulations.slice(),tColors.slice(),nPoints.slice(),currSetPt.slice()]);
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
    image(img1,0,0,cWidth,cHeight);
  }
  if (stepDelaunate == true && triangulations.length>0 && colorMap == true && finishedColoring== false){
      if (workTriangles.length>0){
        displayText=false;
        displayCurves=false;
        displayPoints=false;
        displayAnchors=false;
        var tAC = averageColor(allVertices[workTriangles[stepD]][0],allVertices[workTriangles[stepD]][1],allVertices[workTriangles[stepD+1]][0],allVertices[workTriangles[stepD+1]][1],allVertices[workTriangles[stepD+2]][0],allVertices[workTriangles[stepD+2]][1],colorAccuracy)
        tColors.push(tAC[0],tAC[1],tAC[2]);
        workTriangles = workTriangles.slice(3,workTriangles.length);

      }
      else{
        finishedColoring = true;
        fTime = millis();
        console.log("Coloring took:" + (fTime-sTime)/1000 + " secs")
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
  

  if (displayText == true){
    var accum = 0;
    for (i=0;i<curves.length;i++){
      accum += totalPointsOnCurve[i];
      textSize(20);
      noStroke();
      fill(256,256,256)
      text("Curve: " + (i+1),bPoints[accum-floor(totalPointsOnCurve[i]/2)][0],bPoints[accum-floor(totalPointsOnCurve[i]/2)][1])
    }
  }
  
  var dx=oldX-mouseX;
  var dy=oldY-mouseY;
  accDist = sqrt(dx*dx+dy*dy)
  if (mode==2 && accDist>=critDist && mouseIsPressed){

    if (mouseX>cWidth-1 || mouseX<1 || mouseY >cHeight-1 || mouseY<1){
    }
    else {
      accDist =0;
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
    for (i=0;i<currSetPt.length;i++){
      vertices.push(currSetPt[i]);
    }
    produceJitterPt(currSetPt);
    currSetPt = [];
  
  }
  else if (keyCode===68){
    triangulize();
    finishedColoring = false;
    image(img1,0,0,cWidth,cHeight);
    loadPixels();
    tColors=[];
    sTime = millis();
    $("#displayText").html("Show<br>Text<br>");
    $("#displayText").css("background-color","RGB(100,100,100)");
    $("#displayAnchors").html("Show<br>Anchors<br>");
    $("#displayAnchors").css("background-color","RGB(100,100,100)");
    $("#displayPoints").html("Show<br>Points<br>");
    $("#displayPoints").css("background-color","RGB(100,100,100)");
    $("#displayCurves").html("Show<br>Curves<br>");
    $("#displayCurves").css("background-color","RGB(100,100,100)");
    workTriangles =triangulations[triangulations.length-1];
  }
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
  else if (keyCode===67){
    
    if (noColors == false){
      noColors = true;
      
    }
    else {
      noColors = false;
    }
  }
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
  else if (keyCode===90){

    if (dataPos>0){
      dataPos--;
      loadData(previousData[dataPos])
    }
    
  }
  else if (keyCode===80){
    
      console.log(mouseX,mouseY)
    
    
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
        previousData.splice(dataPos+1,previousData.length-1-dataPos);
      }
      previousData.push([vertices.slice(),curves.slice(),totalPointsOnCurve.slice(),bPoints.slice(),oPoints.slice(),allVertices.slice(),triangulations.slice(),tColors.slice(),nPoints.slice(),currSetPt.slice()]);
      
      
      dataPos=previousData.length-1;
      
    }
  }
  
  
}
function produceJitterPt(verticesSet){
  var flatV= verticesSet.reduce((acc,curr)=> acc.concat(curr));
  curves.push(flatV);
  var total = 5;
  totalPointsOnCurve.push(total);
  for (m=0;m<=total;m++){
    var t=m/total;
    var bx=round(bezierPoint(flatV[0],flatV[2],flatV[4],flatV[6],t))
    var by=round(bezierPoint(flatV[1],flatV[3],flatV[5],flatV[7],t));
    bPoints.push([bx,by]);

    allVertices.push(bPoints[bPoints.length-1]);
    
    var tx = bezierTangent(flatV[0],flatV[2],flatV[4],flatV[6],t);
    var ty = bezierTangent(flatV[1],flatV[3],flatV[5],flatV[7],t);
    
    var a = atan2(ty, tx);
    a-=HALF_PI
    var jitterAmount = 3;
    var randomAmount = 100;
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
function expandImage(mvalue,save){
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
  for (k=0;k<previousData[previousData.length-1].length;k++){
    if (k!=1 && k!=2 && k!=5 && k!=6 && k!=7){
      for (t=0;t<previousData[previousData.length-1][k].length;t++){
        var tempV = expandVertex(previousData[previousData.length-1][k][t],mvalue);
        previousData[previousData.length-1][k][t]=tempV;
      }
    }
  }
  if (save==true){
    
    draw();
    saveCanvas(myCanvas, 'PolyArt', 'jpg');
  }
}
function triangulize(){
    var delaunay;
    delaunay = (Delaunator.from(allVertices))
    triangles = (delaunay.triangles)
    triangulations[0] = triangles;

    displayText=false;
    displayCurves=false;
    displayPoints=false;
    displayAnchors=false;
    image(img1,0,0,cWidth,cHeight)
    if (stepDelaunate == false){
      for (var i = 0; i < triangles.length; i += 3) {

        
        var set1 = fget(allVertices[triangles[i]][0],allVertices[triangles[i]][1]);
        var set2 = fget(allVertices[triangles[i+1]][0],allVertices[triangles[i+1]][1]);
        var set3 = fget(allVertices[triangles[i+2]][0],allVertices[triangles[i+2]][1]);

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
function fget(x,y){
  y=parseInt(y.toFixed(0));
  var off = ((y*cWidth + x)*d*4);
  var components = [ pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3] ]
  return components;
}

function inCanvas(x,y){
  if (x > cWidth-1 || x<0 || y>cHeight-1||y<0){
    return false;
  }
  else {
    return true;
  }
}
function sign(x1,y1,x2,y2,x3,y3){
  return (x1-x3)*(y2-y3)-(x2-x3)*(y1-y3);
}
function pointInTriangle(x1,y1,x2,y2,x3,y3,x4,y4){
  bc1= sign(x4,y4,x1,y1,x2,y2) <0;
  bc2= sign(x4,y4,x2,y2,x3,y3)<0;
  bc3= sign(x4,y4,x3,y3,x1,y1)<0;
  return ((bc1==bc2)&&(bc2==bc3))
}
function averageColor(x1,y1,x2,y2,x3,y3,accuracy){
  var xs =[x1,x2,x3];
  var ys=[y1,y2,y3];
  
  var bx1 =  xs.reduce((acc,curr)=>curr <=acc ?curr : acc)
  var bx2 =  xs.reduce((acc,curr)=>curr >=acc ?curr : acc)
  var by1 =  ys.reduce((acc,curr)=>curr <=acc ?curr : acc)
  var by2 =  ys.reduce((acc,curr)=>curr >=acc ?curr : acc)
  if (quickColor == true){
    return quickAverageColor(x1,y1,x2,y2,x3,y3);
  }
  var tr =0;
  var tg=0;
  var tb=0;
  var totalSample =0;
  for (i=0;i<by2-by1;i+=accuracy){
    for (j=0;j<bx2-bx1;j+=accuracy){
      if (pointInTriangle(x1,y1,x2,y2,x3,y3,bx1+j,by1+i)){
        var tempColor = fget(bx1+j,by1+i)
        tr+=tempColor[0];
        tg+=tempColor[1];
        tb+=tempColor[2];
        totalSample+=1;
      }
    }
  }
  if (totalSample == 0){
    return quickAverageColor(x1,y1,x2,y2,x3,y3);
  }
  return [tr/totalSample,tg/totalSample,tb/totalSample]
}
function quickAverageColor(x1,y1,x2,y2,x3,y3){
  var set1 = fget(x1,y1);
  var set2 = fget(x2,y2);
  var set3 = fget(x3,y3);
  var cR=(set1[0]+set2[0]+set3[0])/3;
  var cG=(set1[1]+set2[1]+set3[1])/3;
  var cB=(set1[2]+set2[2]+set3[2])/3;
  return [cR,cG,cB];
}