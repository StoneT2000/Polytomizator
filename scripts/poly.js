var allVertices=[];
var triangulations = [0];
var tColors = [];
var mode = 1;
var colorOfSquares =[];
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
  resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold]);
  console.log("Finished Setting Up!")
  $("#loadingText").css("top","30%");
  $("#loadingText").css("opacity","0");
  $("#loadingScreen").css("opacity","0");
  window.setTimeout(function(){
    $("#loadingScreen").css("display","none");
    
    $("#loadingText").html("Be patient...we are making art <img src=\"images/loadingSymbol.gif\" style=\"margin-left: 10px\" width=\"32px\" height=\"auto\">");
  },1500)
  $("#brushSize")[0].value = brushSize;
  $("#brushDensity")[0].value = pointDensity+1;
  $("#colorThreshold")[0].value = colorThreshold;
}
var accDist = 0;
var oldX=0;
var oldY=0;
var critDist = 10;
var stepD = 0;

function colorIn(){
  image(img1,0,0,cWidth,cHeight);
  loadPixels();
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
      if (iter==0){
        image(img1,0,0,cWidth,cHeight);
        loadPixels();
      }
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
var filteredPixels = [];
function resetAutoGenListener(values){
  $("#autoGen").off("click")
  $("#autoGen").on("click",function(){
    $("#loadingScreen").css("display","block");
    $("#loadingScreen").css("opacity","1");
    window.setTimeout(function(){
      $("#loadingText").css("top","50%");
      $("#loadingText").css("opacity","1");
    },0)
    if (filteredPixels.length>0){
      copyTo(filteredPixels,pixels);
    }
    else{
      image(img1,0,0,cWidth,cHeight);
      filter(GRAY);
      loadPixels();
    }
    var artWorker = new Worker('scripts/webworkerArtGen.js')
    if (completedFilters== false){
      
      artWorker.postMessage([[values[0],values[1]],pixels,values[2],values[3],values[4]])
      artWorker.onmessage = function(e) {
        var artResult = e.data;
        //console.log(artResult)
        allVertices=artResult[0];
        edgePoints=artResult[1];
        //filteredPixels=artResult[2];
        copyTo(artResult[2],pixels)
        //console.log("Result:",artResult[2],"Pixels now",pixels)
        for (km=0;km<pixels.length;km++){
          filteredPixels.push(pixels[km]);
        }
        splitSquare(20)
        generateRandomSquares(20,0.4)
        pushEdgePointsToAll();
        triangulize();
        finishedColoring = false;

        tColors=[];

        $("#displayPoints").html("Show<br>Points<br>");
        $("#displayPoints").css("background-color","RGB(100,100,100)");
        displayPoints=false;
        completedFilters=true;
        resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold]);
        window.setTimeout(function(){
          $("#loadingScreen").css("opacity","0");
          $("#loadingText").css("opacity","0");
          $("#loadingText").css("top","30%");
          window.setTimeout(function(){
            $("#loadingScreen").css("display","none");
          },1800);
        },0)
        
      }
    }
    else{
      allVertices = [];
      allVertices.push([0,0]);
      allVertices.push([cWidth,0]);
      allVertices.push([0,cHeight]);
      allVertices.push([cWidth,cHeight]);

      for(i=0;i<cWidth/80;i++){
        var tempv = i*80+Math.round(Math.random(0,30));
        var tempv2 = i*80+Math.round(Math.random(0,30));
        if (inCanvas(tempv,cHeight)){
          allVertices.push([tempv,cHeight])
        }
        if (inCanvas(tempv2,cHeight)){
          allVertices.push([tempv2,0])
        }


      }
      for(i=0;i<cHeight/80;i++){
        var tempv = i*80+Math.round(Math.random(0,30));
        var tempv2 = i*80+Math.round(Math.random(0,30));
        if (inCanvas(cWidth,tempv)){
          allVertices.push([cWidth,tempv])
        }
        if (inCanvas(0,tempv2)){
          allVertices.push([0,tempv2])
        }

      }
      generateRandomSquares(20,0.4)
      pushEdgePointsToAll();
      triangulize();
      finishedColoring = false;

      tColors=[];

      $("#displayPoints").html("Show<br>Points<br>");
      $("#displayPoints").css("background-color","RGB(100,100,100)");
      displayPoints=false;
      completedFilters=true;
      $("#loadingScreen").css("opacity","0");
      $("#loadingText").css("opacity","0");
      $("#loadingText").css("top","30%");
      window.setTimeout(function(){
        $("#loadingScreen").css("display","none");
      },1500);
    }
  });
}