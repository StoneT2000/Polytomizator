function splitSquare(accuracy){
  colorOfSquares = [];
  image(img1,0,0);
  loadPixels();
  for (ik=0;ik<cHeight/accuracy;ik++){
    console.log("Chekcing row", ik,cWidth,cHeight)
    for (jk=0;jk<cWidth/accuracy;jk++){
      var tempSquareColor = averageColorSquare(jk*accuracy,ik*accuracy,accuracy,accuracy,1)
      tempSquareColor.push(jk*accuracy,ik*accuracy)
      colorOfSquares.push(tempSquareColor)
    }
    
  }
  console.log(colorOfSquares);
}
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

function lossFunction(manualData,data){
  
}

