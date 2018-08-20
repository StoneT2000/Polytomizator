function generateCubicPoly(accuracy,density,overlay){
  var thisdensity = 0.5;
  if (density){
    thisdensity=density;
  }
  if (!overlay){
    allVertices = [];

  }
  
  allVertices.push([0,0]);
  allVertices.push([cWidth,0]);
  allVertices.push([0,cHeight]);
  allVertices.push([cWidth,cHeight]);
  
  for(i=0;i<cWidth/80;i++){
    var tempv = i*80+round(random(0,2))*accuracy;
    var tempv2 = i*80+round(random(0,2))*accuracy;
    if (inCanvas(tempv,cHeight)){
      allVertices.push([tempv,cHeight])
    }
    if (inCanvas(tempv2,0)){
      allVertices.push([tempv2,0])
    }
        
        
  }
  for(i=0;i<cHeight/80;i++){
    var tempv = i*80+round(random(0,2))*accuracy;
    var tempv2 = i*80+round(random(0,2))*accuracy;
    if (inCanvas(cWidth,tempv)){
      allVertices.push([cWidth,tempv])
    }
    if (inCanvas(0,tempv2)){
      allVertices.push([0,tempv2])
    }


  }
  flowing=false;
  image(img1,0,0,cWidth,cHeight);
  loadPixels();
  splitSquare(accuracy);
  scanSquareLR(accuracy,100000000);
  image(img1,0,0,cWidth,cHeight);
  loadPixels();
  scanSquareUD(accuracy,100000000);
  generateRandomSquares(accuracy,thisdensity)
  flowing = true;
  triangulize();
  finishedColoring = false;
  image(img1,0,0,cWidth,cHeight);

  loadPixels();
  tColors=[];
  sTime = millis();
  $("#displayPoints").html("Show<br>Points<br>");
  $("#displayPoints").css("background-color","RGB(100,100,100)");
  displayPoints=false;
  
}
function splitSquare(accuracy){
  colorOfSquares = [];
  image(img1,0,0,cWidth,cHeight);
  loadPixels();
  var cha = cHeight/accuracy;
  var cwa = cWidth/accuracy;
  for (ik=0;ik<(cha);ik++){
    for (jk=0;jk<(cwa);jk++){
      var tempSquareColor = averageColorSquare(jk*accuracy,ik*accuracy,accuracy,accuracy,1)
      tempSquareColor.push(jk*accuracy,ik*accuracy)
      colorOfSquares.push(tempSquareColor)
    }
    
  }
}
//Average color under a square
function averageColorSquare(x1,y1,sw,sl,accuracy){
  if (x1+sl >cWidth){
    sl = cWidth-x1;
  }
  if (y1+sw>cHeight){
    sw = cHeight-y1;
  }
  var tr =0;
  var tg=0;
  var tb=0;
  var totalSample =0;
  for (i=0;i<sw;i+=accuracy){
    for (j=0;j<sl;j+=accuracy){
        var tempColor = fget(x1+j,y1+i)
        tr+=tempColor[0];
        tg+=tempColor[1];
        tb+=tempColor[2];
        totalSample+=1;
    }
  }
  return [tr/totalSample,tg/totalSample,tb/totalSample]
}
function scanSquareLR(accuracy,degree,degree2){
  var deg2 = 800;
  if (degree2){
    deg2 = degree2;
  }
  for (k=0;k<colorOfSquares.length-1;k++){
    var tsc = colorOfSquares[k];
    var tsc2 = colorOfSquares[k+1];
    var dr = tsc[0]-tsc2[0];
    var dg = tsc[1]-tsc2[1];
    var db = tsc[2]-tsc2[2];
    if (dr*dr+dg*dg+db*db > degree || dr*dr > deg2 || dg*dg>deg2 || db*db > deg2){
      if (flowing == true){
        var cr1=round(random(-10,10));
        var cr2=round(random(-10,10));
        if (inCanvas(tsc[3]+cr1+accuracy,tsc[4]+cr2)){
          allVertices.push([tsc[3]+cr1+accuracy/2,tsc[4]+cr2]);
        }
      }
      else{
        if (inCanvas(tsc[3] +accuracy/2,tsc[4])){
          allVertices.push([tsc[3] +accuracy/2,tsc[4]]);
        }
      }
    }
  }
  generateHashSpace();
}
function scanSquareUD(accuracy,degree,degree2){
  var deg2 = 800;
  if (degree2){
    deg2 = degree2;
  }
  for (k=0;k<colorOfSquares.length-ceil(cWidth/accuracy);k++){
    var tsc = colorOfSquares[k];
    var tsc2 = colorOfSquares[k+ceil(cWidth/accuracy)];
    var dr = tsc[0]-tsc2[0];
    var dg = tsc[1]-tsc2[1];
    var db = tsc[2]-tsc2[2];
    if (dr*dr+dg*dg+db*db > degree || dr*dr > deg2 || dg*dg>deg2 || db*db > deg2){
      if (flowing == true){
        var cr1=round(random(-10,10));
        var cr2=round(random(-10,10));
        if (inCanvas(tsc[3]+cr1,tsc[4]+cr2+accuracy/2)){
          allVertices.push([tsc[3]+cr1,tsc[4]+cr2+accuracy/2]);
        }
      }
      else{
        if (inCanvas(tsc[3],tsc[4]+accuracy/2)){
          allVertices.push([tsc[3],tsc[4]+accuracy/2]);
        }
      }
    }
  }
  generateHashSpace();
}
function generateRandomSquares(accuracy,density){
  for (k=0;k<colorOfSquares.length;k++){
    var tsc= colorOfSquares[k];
    if (random(0,1)<=density){
      if (flowing == true){
        var cr1=round(random(-10,10));
        var cr2=round(random(-10,10));
        if (inCanvas(tsc[3]+cr1,tsc[4]+cr2)){
          allVertices.push([tsc[3]+cr1,tsc[4]+cr2]);
        }
      }
      else {
        if (inCanvas(tsc[3]+accuracy/2,tsc[4])){
          allVertices.push([tsc[3]+accuracy/2,tsc[4]]);
        }
      }
      
      
    }
    
  }
  generateHashSpace();
}
function scanUD(data,degree,accuracy){
  for (j=0;j<cWidth-accuracy;j+=accuracy){
    for (i=0;i<cHeight-accuracy;i+=accuracy){
      var c1=fget(i,j);
      var c2=fget(i,j+accuracy/2);
      var dr = c1[0]-c2[0]
      var dg = c1[1]-c2[1]
      var db = c1[2]-c2[2]
      var da = c1[3]-c2[3]
      if (dr*dr+dg*dg+db*db+da*da > degree || abs(dr)>10 || abs(dg)>10 || abs(db)>10){
        allVertices.push([i,j]);
        if (flowing == true){
          for (ij=0;ij<2;ij++){
            var cr1=round(random(-10,10));
            var cr2=round(random(-10,10));
            if (i+cr1 > cWidth-1 || i+cr1<1 || j+cr2>cHeight-1||j+cr2<1){
          
            }
            else {
              allVertices.push([i+cr1,j+cr2]);
            }
          }
          
        }
      }
    }
  }
}
function scanLR(data,degree,accuracy){
  for (j=0;j<cHeight-accuracy;j+=accuracy){
    for (i=0;i<cWidth-accuracy;i+=accuracy){
      var c1=fget(i,j);
      var c2=fget(i+accuracy/2,j);
      var dr = c1[0]-c2[0]
      var dg = c1[1]-c2[1]
      var db = c1[2]-c2[2]
      var da = c1[3]-c2[3]
      if (dr*dr+dg*dg+db*db+da*da > degree || abs(dr)>100 || abs(dg)>100 || abs(db)>100){
        allVertices.push([i,j]);
        if (flowing == true){
          for (ij=0;ij<2;ij++){
            var cr1=round(random(-10,10));
            var cr2=round(random(-10,10));
            if (i+cr1 > cWidth-1 || i+cr1<1 || j+cr2>cHeight-1||j+cr2<1){
          
            }  
            else {
              allVertices.push([i+cr1,j+cr2]);
            }
          }
          
        }
      }
    }
  }
  generateHashSpace();
}
function autoGenPoints(accuracy,density){
  pDensity=0.1
  if (density){
    pDensity = density
  }
  splitSquare(accuracy);
  scanSquareLR(accuracy,100000000);
  scanSquareUD(accuracy,100000000);
  generateRandomSquares(accuracy,pDensity)
}
function lossFunction(manualData,data){
  
}

