var allVertices=[];
var triangulations = [0];
var tColors = [];
var mode = 1;
var previousData =[];
var colorOfSquares =[];
var dataPos = 0;
var displayTriangulation = true;
var displayPoints = true;
var displayImage = true;
var stepDelaunate = true;
var noColors = false;

var flowing = true;
var brushSize = 100;
var downloading = false;
var magnification = 1;
var finishedColoring = true;
var quickColor = false;
var sTime = 0;
var fTime = 0;
var squares = false;
var colorAccuracy = 1;
var newVertices = [];
var verticesHashTable = [];
var verticesHashTableFlat = [];
var pointDensity = 4;
var exportSVG = false;
var dTriangles = [];
var flowerEffect = false;
var filteringView = false;
var displayEdgePoints = false;
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
  var factor = img1.height/620;
  cWidth = round(img1.width/factor);
  cHeight = round(img1.height/factor);
  myCanvas = createCanvas(cWidth,cHeight);
  
  allVertices.push([0,0]);
  allVertices.push([cWidth,0]);
  allVertices.push([0,cHeight]);
  allVertices.push([cWidth,cHeight]);
  
  for(i=0;i<cWidth/80;i++){
    var tempv = i*80+round(random(0,30));
    var tempv2 = i*80+round(random(0,30));
    if (inCanvas(tempv,cHeight)){
      allVertices.push([tempv,cHeight])
    }
    if (inCanvas(tempv2,0)){
      allVertices.push([tempv2,0])
    }
        
        
  }
  for(i=0;i<cHeight/80;i++){
    var tempv = i*80+round(random(0,30));
    var tempv2 = i*80+round(random(0,30));
    if (inCanvas(cWidth,tempv)){
      allVertices.push([cWidth,tempv])
    }
    if (inCanvas(0,tempv2)){
      allVertices.push([0,tempv2])
    }


  }
  loadPixels();
  generateHashSpace();
  frameRate(60);
  $("#gamedisplay").css("right",(cWidth/2).toString()+"px")
  //$("body").css("width",(cWidth+100).toString()+"px")
  myCanvas.parent('gamedisplay');
  angleMode(DEGREES)
  previousData.push([allVertices.slice(),triangulations.slice(),tColors.slice(),verticesHashTable.slice(),verticesHashTableFlat.slice()]);
  $("#downloadSVG").on("click",function(){
    if (finishedColoring == false){
      alert("Please wait until the coloring is finished before enlargining the work and downloading it")
    }
    else if (triangulations[triangulations.length-1].length > 0){
      downloadSVG(cWidth,cHeight);
    }
    else{
      alert("Make some poly art first")
    }
  });
}
var accDist = 0;
var oldX=0;
var oldY=0;
var critDist = 10;
var stepD = 0;
function colorIn(){
  sTime =millis();
  for (stepD1=0;stepD1<triangulations[0].length-1;stepD1+=3){
    
    var tAC=[0,0,0];
    tAC = averageColor(verticesHashTableFlat[triangulations[triangulations.length-1][stepD1]][0],verticesHashTableFlat[triangulations[triangulations.length-1][stepD1]][1],verticesHashTableFlat[triangulations[triangulations.length-1][stepD1+1]][0],verticesHashTableFlat[triangulations[triangulations.length-1][stepD1+1]][1],verticesHashTableFlat[triangulations[triangulations.length-1][stepD1+2]][0],verticesHashTableFlat[triangulations[triangulations.length-1][stepD1+2]][1],colorAccuracy)
    tColors.push(tAC[0],tAC[1],tAC[2]);
        
  }
  finishedColoring = true;
  fTime = millis();
  console.log("Coloring took:" + ((fTime-sTime)/1000).toFixed(3) + " secs")
}
var iterStep = 4;
var fs = 0;
var ff = 0;
var fr = 0;
var fc = 0;
var flowerEffectTime=10;
function draw(){
  if (fc===0){
    fs = millis();
  }
  
  background("#FFFFFF")
  if (displayImage == true){
    image(img1,0,0,cWidth,cHeight);
  }
  
  if (flowerEffect === true){
    iterStep = ceil(((triangulations[triangulations.length-1].length)/(fr))/flowerEffectTime);
    for (iter=0;iter<iterStep;iter++){

      if (stepDelaunate == true && triangulations.length>0 && finishedColoring== false){
        if (triangulations[triangulations.length-1].length>0 && stepD <=triangulations[triangulations.length-1].length-1){
          if (stepD === 0){
            sTime = millis();
          }
          var tAC=[0,0,0];
          tAC = averageColor(verticesHashTableFlat[triangulations[triangulations.length-1][stepD]][0],verticesHashTableFlat[triangulations[triangulations.length-1][stepD]][1],verticesHashTableFlat[triangulations[triangulations.length-1][stepD+1]][0],verticesHashTableFlat[triangulations[triangulations.length-1][stepD+1]][1],verticesHashTableFlat[triangulations[triangulations.length-1][stepD+2]][0],verticesHashTableFlat[triangulations[triangulations.length-1][stepD+2]][1],colorAccuracy)
          tColors.push(tAC[0],tAC[1],tAC[2]);

          stepD+=3;

        }
        else{
          finishedColoring = true;
          fTime = millis();
          console.log("Coloring took:" + ((fTime-sTime)/1000).toFixed(3) + " secs")
        }

      }
    }
  }
  else {
    if (finishedColoring == false){
      colorIn();
      finishedColoring = true;
    }
  }
  
  stroke(2);
  if (colorOfSquares.length>0 && squares==true){
    noStroke();
    for (i=0;i<colorOfSquares.length;i++){
      var tempSquareColor = colorOfSquares[i];
      fill(tempSquareColor[0],tempSquareColor[1],tempSquareColor[2])
      rect(tempSquareColor[3],tempSquareColor[4],20,20)
    }
  }
  fill(256,256,256)
  if (displayTriangulation == true){
    for (j=0;j<triangulations.length;j++){
      delaunayDisplay(triangulations[j]);
      
    }

  }
  fill(256,256,256)
  stroke(0,0,0)
  if (displayPoints == true){
    for (j=0;j<verticesHashTable.length;j++){
      for (k=0;k<verticesHashTable[j].length;k++){
        ellipse(verticesHashTable[j][k][0],verticesHashTable[j][k][1],5,5)
      }
    }
    for (j=0;j<edgePoints.length;j++){
      if (edgePoints[j][2]>colorThreshold && displayEdgePoints == true){
        ellipse(edgePoints[j][0],edgePoints[j][1],5)
      }
    }
  }
  
  
  $("#numberPoints").text(allVertices.length +" points")
  $("#numberTriangles").text(parseInt(triangulations[triangulations.length-1].length/3) +" triangles")
  if (finishedColoring ==true){
    $("#lastTiming").text(((fTime-sTime)/1000).toFixed(3) +" seconds")
  }
  var dx=oldX-mouseX;
  var dy=oldY-mouseY;
  accDist = sqrt(dx*dx+dy*dy)
  if (mode===2){
    if(downloading == false){
      noFill();
      stroke(2);
      stroke(200,200,200)
      ellipse(mouseX,mouseY,brushSize*2,brushSize*2)
    }
    if (accDist>=critDist && mouseIsPressed){

      
      if (mouseX>cWidth-1 || mouseX<1 || mouseY >cHeight-1 || mouseY<1){
      }
      else {
        accDist =0;
        critDist = random(15,20)
        oldX=mouseX;
        oldY=mouseY;
        allVertices.push([round(mouseX),round(mouseY)]);

        updateHashSpace(round(mouseX),round(mouseY),true)

        for (i=0;i<pointDensity;i++){
          var r1=random(-brushSize,brushSize)
          var r2=random(-brushSize,brushSize);
          if (mouseX+r1>cWidth-1 || mouseX+r1<1 || mouseY+r2 >cHeight-1 || mouseY+r2<1){
          }
          else{
            allVertices.push([round(mouseX+r1),round(mouseY+r2)]);

            updateHashSpace(round(mouseX+r1),round(mouseY+r2),true)
          }
        }
      }

    }
  }

  if (mode===3){
    if(downloading == false){
      noFill();
      stroke(2);
      stroke(200,200,200)
      ellipse(mouseX,mouseY,brushSize*2,brushSize*2)
    }
    if (mouseIsPressed){
      var xs = floor(mouseX/50);
      var ys = floor(mouseY/50);

      
      var verticesRange = [];
      for (k=floor(-brushSize/50-2);k<ceil(brushSize/50+2);k++){
        for (j=floor(-brushSize/50-2);j<ceil(brushSize/50+2);j++){

          if (squaredist(xs,ys,xs+k,ys+j) <= (brushSize/50)*(brushSize/50)){

            if (xs+k>=0 && ys+j>=0 && xs+k<=ceil(cWidth/50) && ys+j<=ceil(cHeight/50)){
              verticesRange.push(verticesHashTable[findIndexFromHash((xs+k)*100+ys+j)])

            }
            
          }
        }
      }

      if (verticesRange.length >0){
        for (k=0;k<verticesRange.length;k++){
          if (verticesRange[k]!= undefined){
            for (p=0;p<verticesRange[k].length;p++){
              var dx = verticesRange[k][p][0]-mouseX;
              var dy = verticesRange[k][p][1]-mouseY;

              if (dx*dx+dy*dy <= brushSize*brushSize){

                updateHashSpace(verticesRange[k][p][0],verticesRange[k][p][1],false);
              }
            }
          }


        }
      }
      
    }
  }
  
  
  fc++;
  if (fc === 5){
    ff = millis();
    fr = ceil(4/((ff-fs)/1000));
    fc = 0; 
  }
  if (filteringView == true){
    updatePixels();
  }
}
function hashCoordinate(x,y){
  return floor(x/50)*100+floor(y/50);
}
function findIndexFromHash(hash){
  var xi = floor((hash/100));
  var yi = hash%100;
  return xi+yi*ceil(cWidth/50)
}
function generateHashSpace(){
  verticesHashTable=[];
  //50x50 squares in grid
  for (i=0;i<ceil(cWidth/50)*ceil(cHeight/50);i++){
    verticesHashTable.push([]);
    
  }
  for (i=0;i<allVertices.length;i++){

    var hashVal = hashCoordinate(allVertices[i][0],allVertices[i][1]);
    var index = findIndexFromHash(hashVal);
    verticesHashTable[index].push([allVertices[i][0],allVertices[i][1]])
  }
}
function updateHashSpace(x,y,add){
  
  var hashVal = hashCoordinate(x,y);
  var index = findIndexFromHash(hashVal);
  if (add==true){

    verticesHashTable[index].push([x,y])
  }
  if (add==false){
    /*
    var currIndex = 0;
    while(currIndex<verticesHashTable[index].length){
      if (verticesHashTable[index][i][0] == x && verticesHashTable[index][i][1] == y){
        verticesHashTable[index].splice(i,1)
      }
      else {
        currIndex++;
      }
    }
    */
    for (i=0;i<verticesHashTable[index].length;i++){

      if (verticesHashTable[index][i][0] == x && verticesHashTable[index][i][1] == y){
        verticesHashTable[index].splice(i,1)
      }
    }
  }
}

function keyPressed(){
  if (keyCode === 32) {
    downloading = true;
    draw();
    saveCanvas(myCanvas, 'myCanvas', 'jpg');
    downloading = false;
  }
  else if (keyCode===68){
    triangulize();
    
    finishedColoring = false;
    image(img1,0,0,cWidth,cHeight);
    noColors=false;
    $("#displayColor").html("Hide<br>Colors<br>");
    $("#displayColor").css("background-color","RGB(40,40,40)");
    loadPixels();
    tColors=[];
    sTime = millis();
    $("#displayPoints").html("Show<br>Points<br>");
    $("#displayPoints").css("background-color","RGB(100,100,100)");
    displayPoints=false;
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
    if (noColors === false){
      noColors = true;
      $("#displayColor").html("Show<br>Colors<br>");
      $("#displayColor").css("background-color","RGB(100,100,100)");
      
    }
    else {
      noColors = false;
      $("#displayColor").html("Hide<br>Colors<br>");
      $("#displayColor").css("background-color","RGB(40,40,40)");
    }
  }
  else if (keyCode===90){

    if (dataPos>0){
      dataPos--;
      loadData(previousData[dataPos])
    }
    
  }
  else if (keyCode===80){
    mode = 1;
    $("#pointBrush").css("background-color","RGB(140,140,140)")
    $("#lineBrush").css("background-color","")
    $("#eraser").css("background-color","")
    
  }
  else if (keyCode ===69){
    mode = 3;
    $("#eraser").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#lineBrush").css("background-color","")
  }
  else if (keyCode === 66){
    mode = 2;
    $("#lineBrush").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#eraser").css("background-color","")
  }
  else if (keyCode === 84){
    mode = 4;
    $("#triangleMover").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#lineBrush").css("background-color","")
    $("#eraser").css("background-color","")
  }
}
function mouseClicked(){

  if (mouseX<=cWidth && mouseX>=0){
    if(mouseY<=cHeight && mouseY>=0){

      if (mode == 1){
        allVertices.push([round(mouseX),round(mouseY)]);
        newVertices.push([round(mouseX),round(mouseY)]);
        updateHashSpace(round(mouseX),round(mouseY),true)
      }
      if (mode==2){
      }
      if (mode ===4){
        
        var tng = triangulations[0];
        for (k=0;k<tng.length;k+=3){ 
          if (pointInTriangle(verticesHashTableFlat[tng[k]][0],verticesHashTableFlat[tng[k]][1],verticesHashTableFlat[tng[k+1]][0],verticesHashTableFlat[tng[k+1]][1],verticesHashTableFlat[tng[k+2]][0],verticesHashTableFlat[tng[k+2]][1],mouseX,mouseY)){
            if (tColors[k] >=0){
              tColors[k] = -1;
            }
            else if (tColors[k] ==-1){
              var tAC=[0,0,0];
              tAC = averageColor(verticesHashTableFlat[tng[k]][0],verticesHashTableFlat[tng[k]][1],verticesHashTableFlat[tng[k+1]][0],verticesHashTableFlat[tng[k+1]][1],verticesHashTableFlat[tng[k+2]][0],verticesHashTableFlat[tng[k+2]][1],colorAccuracy)
              tColors[k]=tAC[0];
              tColors[k+1]=tAC[1];
              tColors[k+2]=tAC[2];
            }
          }
        };

      }

      
    }
  }
  
  
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
    else if (tColors[i]==-1){
      noFill();
      noStroke();

    }
    else {
      fill(256,256,256);
      stroke(10,10,10);
    }
    
    if (verticesHashTableFlat.length > 0){

      triangle(verticesHashTableFlat[tng[i]][0],verticesHashTableFlat[tng[i]][1],verticesHashTableFlat[tng[i+1]][0],verticesHashTableFlat[tng[i+1]][1],verticesHashTableFlat[tng[i+2]][0],verticesHashTableFlat[tng[i+2]][1]);
    }
    
  }
}
function loadData(dataStored){
  if (dataStored === null){
    alert("No recently saved data")
  }
  allVertices=dataStored[0];
  triangulations=dataStored[1];
  tColors=dataStored[2];
  verticesHashTable=dataStored[3];
  verticesHashTableFlat=dataStored[4];
  triangulize();
  displayPoints=true;
  $("#displayPoints").html("Hide<br>Points<br>");
  $("#displayPoints").css("background-color","RGB(40,40,40)");
}
function saveData(){
  var currentData = [allVertices.slice(),triangulations.slice(),tColors.slice(),verticesHashTable.slice(),verticesHashTableFlat.slice()];
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
  var cx=0;
  var ch=0;
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
  for (p=0;p<verticesHashTable.length;p++){
    
    for (l=0;l<verticesHashTable[p].length;l++){
      var tempV = expandVertex(verticesHashTable[p][l],mvalue);
      verticesHashTable[p][l] = tempV;
      
    }
  }
  verticesHashTableFlat = verticesHashTable.reduce(function(acc,curr){return acc.concat(curr)});
  if (save==true){
    downloading = true;
    draw();
    saveCanvas(myCanvas, 'PolyArt', 'jpg');
    downloading = false;
  }
}
function triangulize(){
    var delaunay;
    verticesHashTableFlat = verticesHashTable.reduce(function(acc,curr){return acc.concat(curr)});
    delaunay = (Delaunator.from(verticesHashTableFlat))
    stepD=0;
      
    var triangles = (delaunay.triangles)
    triangulations[0] = triangles;
    
    displayPoints=false;
    displayTriangulation=false;
    image(img1,0,0,cWidth,cHeight)

    displayPoints=true;
    displayTriangulation=true;
    $("#displayTriangulation").html("Hide <br>Triangles<br>");
    $("#displayTriangulation").css("background-color","RGB(40,40,40)");
    stepD = 0;
}
function fget(x,y){
  y=parseInt(y.toFixed(0));
  var off = ((y*d*cWidth + x)*d*4);
  var components = [ pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3] ]
  return components;
}

function inCanvas(x,y){
  if (x > cWidth || x<0 || y>cHeight||y<0){
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
  var bx1 =  xs.reduce(function(acc,curr){return curr <=acc ?curr : acc})
  var bx2 =  xs.reduce(function(acc,curr){return curr >=acc ?curr : acc})
  var by1 =  ys.reduce(function(acc,curr){return curr <=acc ?curr : acc})
  var by2 =  ys.reduce(function(acc,curr){return curr >=acc ?curr : acc})
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
function squaredist(x1,y1,x2,y2){
  return (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)
}
function autoGenerateArt(){
  if (completedFilters == false){
    //checks if a filter has already been done
      completedFilters=true;
      image(img1,0,0);
      filter(GRAY);
      loadPixels();
      console.log(pixels);
      changePixels3('smooth');
      changePixels3('edge');
  }
  allVertices = [];
  allVertices.push([0,0]);
  allVertices.push([cWidth,0]);
  allVertices.push([0,cHeight]);
  allVertices.push([cWidth,cHeight]);

  for(i=0;i<cWidth/80;i++){
    var tempv = i*80+round(random(0,30));
    var tempv2 = i*80+round(random(0,30));
    if (inCanvas(tempv,cHeight)){
      allVertices.push([tempv,cHeight])
    }
    if (inCanvas(tempv2,cHeight)){
      allVertices.push([tempv2,0])
    }


  }
  for(i=0;i<cHeight/80;i++){
    var tempv = i*80+round(random(0,30));
    var tempv2 = i*80+round(random(0,30));
    if (inCanvas(cWidth,tempv)){
      allVertices.push([cWidth,tempv])
    }
    if (inCanvas(0,tempv2)){
      allVertices.push([0,tempv2])
    }

  }
  splitSquare(20)
  generateRandomSquares(20,0.4)
  pushEdgePointsToAll();
  triangulize();

  finishedColoring = false;
  image(img1,0,0,cWidth,cHeight);

  loadPixels();
  tColors=[];
  $("#displayPoints").html("Show<br>Points<br>");
  $("#displayPoints").css("background-color","RGB(100,100,100)");
  displayPoints=false;
}