
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
      image(img1,0,0,cWidth,cHeight);
      filter(GRAY);
      loadPixels();
      console.log(pixels);
      pixels = changePixels3('smooth',pixels);
      pixels = changePixels3('edge',pixels);
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