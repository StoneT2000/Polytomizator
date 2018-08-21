var edgePoints = [];
var colorThreshold = 40;
var edgePointsHashTable;
var operator3={
  smooth:{arr:[1,1,1,
          1,1,1,
          1,1,1],type:"blur"},
  edge:{arr:[0,1,0,
       1,-4,1,
       0,1,0],type:'filter'},
  edgeLR:{arr:[0,-1,0,
         0,2,0,
         0,-1,0],type:'filter'},
  edgeUD:{arr:[0,0,0,
         -1,2,-1,
         0,0,0],type:'filter'},
  sharpen:{arr:[0,-1,0,
          -1,5,-1,
          0,-1,0],type:'filter'},
  gaussian:{arr:[1,2,1,
           2,4,2,
           1,2,1],type:'blur'},
  sobelX:{arr:[1,2,1,
              0,0,0,
              -1,-2,-1],
          type:'filter'},
  sobelY:{arr:[1,0,-1,
              2,0,-2,
              1,0,-1],
          type:'filter'},
  gx:{arr:[-1,-1,-1,
              0,0,0,
              1,1,1],
          type:'filter'},
  gy:{arr:[-1,0,1,
              -1,0,1,
              -1,0,1],
          type:'filter'}
  
}
var operator5={
  smooth:{arr:[1,1,1,
          1,1,1,
          1,1,1],type:"blur",sum:25},
  gaussian:{arr:
          [1,4,7,4,1,
           4,16,26,16,4,
           7,26,41,26,7,
           4,16,26,16,4,
           1,4,7,4,1],type:'blur',sum:273},
}
function ind(x,y){
  return (y*d*cWidth + x)*d*4;
}

function changePixels3(filter,storedPixelData){
  displayImage=true;
  displayTriangulation=false;
  displayPoints=false;
  edgePoints = [];
  if (!filter){
    filter = "smooth"
  }
  var pixelsCopy = JSON.parse(JSON.stringify(storedPixelData));
  for (k=0;k<=cWidth;k+=1){
    for (j=0;j<=cHeight;j+=1){
      //var loc = [ind(k,j-1),ind(k-1,j),ind(k,j),ind(k+1,j),ind(k,j+1)];
      var loc = [ind(k-1,j-1),ind(k,j-1),ind(k+1,j-1),ind(k-1,j),ind(k,j),ind(k+1,j),ind(k-1,j+1),ind(k,j+1),ind(k+1,j+1)];
      var rgb = smoothAvg3(k,j,storedPixelData,filter)
      pixelsCopy[loc[4]]= rgb[0];
      pixelsCopy[loc[4]+1]= rgb[1]
      pixelsCopy[loc[4]+2]= rgb[2]
      
      
    }
  }
  //copyTo(pixelsCopy,pixels)
  //updatePixels();
  //displayTriangulation=true;
  //displayPoints=true;
  return pixelsCopy;
}
function smoothAvg3(x,y,data,filter){
  var loc =  [ind(x-1,y-1),ind(x,y-1),ind(x+1,y-1),ind(x-1,y),ind(x,y),ind(x+1,y),ind(x-1,y+1),ind(x,y+1),ind(x+1,y+1)];
  var weight = [1,1,1,
                1,1,1,
                1,1,1];
  weight = operator3[filter].arr;
  var colors = [0,0,0]
  var totalWeight = 1;
  
  if (operator3[filter].type == 'blur'){
    for (ic=0;ic<weight.length;ic++){
      totalWeight+=Math.abs(weight[ic]);
    }
  }
  for (i=0;i<loc.length;i++){
    colors[0]+=data[loc[i]]*weight[i]
    colors[1]+=data[loc[i]+1]*weight[i]
    colors[2]+=data[loc[i]+2]*weight[i]
    
  }
  colors[0]/=totalWeight;
  colors[1]/=totalWeight;
  colors[2]/=totalWeight;
  if (filter == "edge" && colors[0]>=10 && Math.random(0,1) < 0.2){
    edgePoints.push([x,y,colors[0]]);
  }
  return colors;
}
function pushEdgePointsToAll(){
  for (ink=0;ink<edgePoints.length;ink++){
    if (edgePoints[ink][2] > colorThreshold){
      allVertices.push([edgePoints[ink][0],edgePoints[ink][1]]);
    }
    
  }
  //Pushes to allVertices as well
  generateHashSpace();
}
function changePixels5(filter){
  if (!filter){
    filter = "smooth"
  }
  var pixelsCopy = JSON.parse(JSON.stringify(pixels));
  for (k=0;k<=cWidth;k+=1){
    for (j=0;j<=cHeight;j+=1){
      //var loc = [ind(k,j-1),ind(k-1,j),ind(k,j),ind(k+1,j),ind(k,j+1)];
      var loc = [ind(k-2,j-2),ind(k-1,j-2),ind(k,j-2),ind(k+1,j-2),ind(k+2,j-2),
                 ind(k-2,j-1),ind(k-1,j-1),ind(k,j-1),ind(k+1,j-1),ind(k+2,j-1),
                 ind(k-2,j),ind(k-1,j),ind(k,j),ind(k+1,j),ind(k+2,j),
                 ind(k-2,j+1),ind(k-1,j+1),ind(k,j+1),ind(k+1,j+1),ind(k+2,j+1),
                 ind(k-2,j+2),ind(k-1,j+2),ind(k,j+2),ind(k+1,j+2),ind(k+2,j+2)];
      var rgb = smoothAvg3(k,j,pixels,filter)
      pixelsCopy[loc[12]]= rgb[0];
      pixelsCopy[loc[12]+1]= rgb[1]
      pixelsCopy[loc[12]+2]= rgb[2]
    }
  }
  copyTo(pixelsCopy,pixels)
  updatePixels();
}
function smoothAvg5(x,y,data,filter){
  var loc = [ind(k-2,j-2),ind(k-1,j-2),ind(k,j-2),ind(k+1,j-2),ind(k+2,j-2),
             ind(k-2,j-1),ind(k-1,j-1),ind(k,j-1),ind(k+1,j-1),ind(k+2,j-1),
             ind(k-2,j),ind(k-1,j),ind(k,j),ind(k+1,j),ind(k+2,j),
             ind(k-2,j+1),ind(k-1,j+1),ind(k,j+1),ind(k+1,j+1),ind(k+2,j+1),
             ind(k-2,j+2),ind(k-1,j+2),ind(k,j+2),ind(k+1,j+2),ind(k+2,j+2)];
  var weight = [1,1,1,
                1,1,1,
                1,1,1];
  weight = operator5[filter].arr;
  var colors = [0,0,0]
  var totalWeight = 1;
  
  if (operator5[filter].type == 'blur'){
    //totalWeight = weight.reduce((acc,curr)=> acc+abs(curr));
    totalWeight = operator5[filter].sum;
  }
  for (i=0;i<loc.length;i++){
    colors[0]+=data[loc[i]]*weight[i]
    colors[1]+=data[loc[i]+1]*weight[i]
    colors[2]+=data[loc[i]+2]*weight[i]
    
  }
  colors[0]/=totalWeight;
  colors[1]/=totalWeight;
  colors[2]/=totalWeight;
  return colors;
}

//Use this function isntead of JSON.parse(JSON.stringify) way as sometimes it doesn't work?
function copyTo(arr1,arr2,initialize){
  //copies array 1 to array 2
  if (initialize){
    for (index=0;index<arr2.length;index++){
      arr2.push(arr1[index]);
    }
  }
  else{
    for (index=0;index<arr2.length;index++){
      arr2[index] =  arr1[index];
    }
  }
}

function ind1(x,y){
  //use to find position in ega array.
  return (y*d*cWidth + x)*d;
}
function edgeGradientAngle(x,y,data){
  //assume grayscale
  
  var grx = smoothAvg3(x,y,data,'sobelX')[0];
  var gry = smoothAvg3(x,y,data,'sobelY')[0];
  //remove sqrt if too slow
  return [(grx*grx + gry*gry),roundAngle(atan(gry/grx))]
  //without sqrt, large images possible used in poly are like 3s or less
}
function roundAngle(rad){
  //0: vert, 1: top right, 2:horizontal, 3:bottom right
  var api0 = 3*Math.PI/8
  var api1 = Math.PI/8
  var api2 = -Math.PI/8
  var api3 = -3*Math.PI/8
  if (rad > api0|| rad < api3){
    return 0;
  }
  else if (rad > api1){
    return 1;
  }
  else if (rad < api2){
    return 3;
  }
  else {
    return 2;
  }
}
function generateEGA(data){
  //Left right
  filter(GRAY);
  loadPixels();
  //change to grayscale first
  var pixelInfo = [];
  var stime = millis();
  for (ip=0;ip<cWidth;ip++){
    for (jp=0;jp<cHeight;jp++){

      pixelInfo.push(edgeGradientAngle(jp,ip,data));
    }
  }
  console.log("Time: " + (millis()-stime));
  return pixelInfo;
}
function supress(x,y,data){
  var thisIndex = ind1(x,y);
  var surrounding = neighborhoodIndices(x,y,1);
  var surroundingSameDir = [];
  var grad = data[thisIndex][0]
  var dir = data[thisIndex][1]
  console.log(surrounding)
  for (locIndex=0;locIndex<surrounding.length;locIndex++){
    if (data[surrounding[locIndex]][1] == dir){
      surroundingSameDir.push(data[surrounding[locIndex]]);
    }
  }
  console.log(surroundingSameDir)
  for (it=0;it<surroundingSameDir.length;it++){
    console.log(surroundingSameDir[0])
    if (grad < surroundingSameDir[it][0]){
      console.log("Not Local Max!",grad)
    }
  }
  console.log(surroundingSameDir,"Local Max!",data[thisIndex]);
  
}
function neighborhoodIndices(x,y,r){
  var positions = [];

  for (i=-r;i<=r;i++){
    for (j=-r;j<=r;j++){
      positions.push(ind1(j+y,i+x));
    }
  }
  return positions;
}
function reduceDensity(limit){
  //iterate through all points in edgepoints within decreasing brightness order
  for (bright = 256;bright>=limit;bright--){
    var setOfPoints = edgePoints.filter(function(value){
      if (value[2] == bright){
        return true;
      }
    });
    
    for (r=0;r<setOfPoints.length;r++){
      //console.log(setOfPoints[r])
      var thisHash = hashCoordinate(setOfPoints[r][0],setOfPoints[r][1])
      var arrayIndex = findIndexFromHash(thisHash);
      //vertices hashTable is an array that represents the grid, each sub array is the set of vertices in that square
      var checkArray = verticesHashTable[arrayIndex];
      //console.log(verticesHashTable[arrayIndex],arrayIndex);
      for (pindex = 0; pindex<checkArray.length;pindex++){
        if (setOfPoints[r][0] != checkArray[pindex][0]){
          if (squaredist(setOfPoints[r][0],setOfPoints[r][1],checkArray[pindex][0],checkArray[pindex][1]) <= 100){
            verticesHashTable[arrayIndex][pindex][0] = -10;
            //mark for removal
          }
        }
        
          
      }
      var current = 0;
      while(current<verticesHashTable[arrayIndex].length){
        if (verticesHashTable[arrayIndex][current][0] == -10){
          verticesHashTable[arrayIndex].splice(current,1);
        }
        else{
          current++;
        }
      }

    }
    
    //Hash function
  }
}
function basicReduceDensity(){
  for (bright = 256;bright>=0;bright--){
    var setOfPoints = edgePoints.filter(function(value){
      if (value[2] == bright){
        return true;
      }
    });
    
  }
}