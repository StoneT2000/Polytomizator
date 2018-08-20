var allVertices=[]; //Store all vertices. NOTE, this does not record when vertices are removed

//Triangulations variable stores the order of the triangles vertices
var triangulations = [0];

//Colors of triangles
var tColors = [];

//Modes for different brushes
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

//Calculating time stats
var sTime = 0;
var fTime = 0;

//Display squares created by generateCubicPoly.
var squares = false;
var colorAccuracy = 1;

//verticesHashTable(flat) are global variables edited by a bunch of functions
//Ultimately, verticesHashTableFlat (and triangulations) are used by delaunayDisplay to display triangles
//verticesHashTable is used for quick calculations for things like erasers. It is also a real reflection of all the vertices in a canvas.
var verticesHashTable = [];
var verticesHashTableFlat = [];

var tempVerticesHashTable = [];
var tempVerticesHashTableFlat = [];

//Number of points drawn per stroke
var pointDensity = 4;
var exportSVG = false;

var flowerEffect = false; //Whether or not to have the flower effect
var filteringView = false; //Debugging purposes
var displayEdgePoints = false; //Display points whenusing filters
var snapping = false; //Snap points to a grid when using brushes
var snappingAccuracy = 20; //How big squares in grid are
//Testing different ways to display the information 
//displayMode = 0 is normal, 1:rectangles 2:circles 3:animated triangles 4: animated rectangles
var displayMode = 0; 
var artstyle = 0; //0: Normal, 1: cubic, 2: ??


//Store past vertices placement
var storedVertices = [];
//Max number of undos allowed.
var max_undo = 50;

var myCanvas;
var img1;
var d;

var triangleCanvasLayer;
function preload(){
  img1 = loadImage('images/white.jpg')
}
function setup(){
  //pixel density is important for screens with different resolutions (e.g old vs new macbooks)
  d = pixelDensity();
  loadPixels();
  
  //Fix the height of the uploaded image based on height, it can't be too large
  var factor = img1.height/620;
  cWidth = round(img1.width/factor);
  cHeight = round(img1.height/factor);
  myCanvas = createCanvas(cWidth,cHeight);
  
  
  //create off screen triangle generating layer
  triangleCanvasLayer = createGraphics(cWidth,cHeight)
  
  //Initialize points on corners and sides
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
  
  
  //Initialize storedVertices array with 50 empty slots
  for (var slot_index = 0; slot_index < max_undo; slot_index++){
    storedVertices.push([]);
  }
  
  //Store initial vertices
  recordVertices();
  verticesHashTableFlat = verticesHashTable.reduce(function(acc,curr){return acc.concat(curr)});
  
  
  
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
  resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold],0);
  console.log("Finished Setting Up!")
  $("#loadingText").css("top","30%");
  $("#loadingText").css("opacity","0");
  $("#loadingScreen").css("opacity","0");
  window.setTimeout(function(){
    $("#loadingScreen").css("display","none");
    
    $("#loadingText").html("Patience, we are making art <img src=\"images/loadingSymbol.gif\" style=\"margin-left: 10px\" width=\"32px\" height=\"auto\">");
  },1500)
  $("#brushSize")[0].value = brushSize;
  $("#brushDensity")[0].value = pointDensity+1;
  $("#colorThreshold")[0].value = colorThreshold;
  document.getElementById('normal').selected = true
  $("#artstyles").on('change',function(){
    console.log("changeStyle");
    if (document.getElementById('normal').selected == true){
      artstyle=0; //resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold],artstyle);
    }
    else if (document.getElementById('cubic').selected == true){
      artstyle = 1;
      //resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold],artstyle);
    }
  });
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
          
          //Once finished coloring, re color the off screen graphics in case
          for (j=0;j<triangulations.length;j++){
            delaunayDisplay(triangulations[j], triangleCanvasLayer);

          }
        }

      }
    }
  }
  else {
    if (finishedColoring == false){
      colorIn();
      finishedColoring = true;
      for (j=0;j<triangulations.length;j++){
        delaunayDisplay(triangulations[j], triangleCanvasLayer);

      }
    }
  }
  
  stroke(2);
  
  //Display pixelated
  if (colorOfSquares.length>0 && squares==true){
    noStroke();
    for (i=0;i<colorOfSquares.length;i++){
      var tempSquareColor = colorOfSquares[i];
      fill(tempSquareColor[0],tempSquareColor[1],tempSquareColor[2])
      rect(tempSquareColor[3],tempSquareColor[4],20,20)
    }
  }
  fill(256,256,256)
  
  
  if (displayTriangulation == true && finishedColoring == true){
    image(triangleCanvasLayer,0,0);
    //Each time an option is enacted, run through delaunayDisdplay to show that option
    //options such as hidhing colors
    
    /* old method uses delaunayDisplay, but not the ctx.triangles part...
    for (j=0;j<triangulations.length;j++){
      delaunayDisplay(triangulations[j], myCanvas);
      
    }
    */

  }
  
  //Procedurally display those triangles only when it is still coloring
  if (flowerEffect == true && finishedColoring != true && displayTriangulation == true){
    
    for (j=0;j<triangulations.length;j++){
      //We use this function becasue its faster than transfering from the off screen graphics to the on screen canvas.
      delaunayDisplay_flower_effect(triangulations[j]);

    } 
    
  }

  
  fill(256,256,256)
  stroke(0,0,0)
  if (displayPoints == true){
    for (j=0;j<verticesHashTable.length;j++){
      //ellipse(verticesHashTableFlat[j][0], verticesHashTableFlat[j][1], 5, 5);
      
      for (k=0;k<verticesHashTable[j].length;k++){
        ellipse(verticesHashTable[j][k][0],verticesHashTable[j][k][1],5,5)
      }
      
    }
    //Points detected by filters
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
  if (mode === 2){
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
        var vpx = (round(mouseX));
        var vpy = (round(mouseY));
        if (snapping == true){
          vpx = vpx-vpx%snappingAccuracy;
          vpy = vpy-vpy%snappingAccuracy;
        }
        allVertices.push([vpx,vpy]);
        updateHashSpace(vpx,vpy,true)

        for (i=0;i<pointDensity;i++){
          var r1=random(-brushSize,brushSize)
          var r2=random(-brushSize,brushSize);
          if (mouseX+r1>cWidth-1 || mouseX+r1<1 || mouseY+r2 >cHeight-1 || mouseY+r2<1){
          }
          else{
            var vpx = (round(mouseX+r1));
            var vpy = (round(mouseY+r2));
            if (snapping == true){
              vpx = vpx-vpx%snappingAccuracy;
              vpy = vpy-vpy%snappingAccuracy;
            }
            allVertices.push([vpx,vpy]);

            updateHashSpace(vpx,vpy,true)
          }
        }
      }

    }
    else if (!mouseIsPressed){
      //Allows u to use brush on same spot by clicking multiple times
      critDist = 0;
    }
  }

  //Erase points
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
//Reset Auto Gen listner removes the old listener and adds the new one.
function resetAutoGenListener(values,style){
  $("#autoGen").off("click")

  $("#autoGen").on("click",function(){
    if (artstyle == 0){
      noLoop();
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

          css_buttons.displayPoints(false);
          displayPoints=false;
          completedFilters=true;
          resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold],style);
          window.setTimeout(function(){
            $("#loadingScreen").css("opacity","0");
            $("#loadingText").css("opacity","0");
            $("#loadingText").css("top","30%");
            window.setTimeout(function(){
              $("#loadingScreen").css("display","none");
            },1800);
          },0)
          loop();

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

        css_buttons.displayPoints(false);
        displayPoints=false;
        completedFilters=true;
        $("#loadingScreen").css("opacity","0");
        $("#loadingText").css("opacity","0");
        $("#loadingText").css("top","30%");
        window.setTimeout(function(){
          $("#loadingScreen").css("display","none");
        },1500);
        loop();
        
      }
    }
    else if (artstyle == 1){
      generateCubicPoly(14,0.9);
    }
  });
}