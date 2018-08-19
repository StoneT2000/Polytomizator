importScripts('poly_helper.js')
importScripts('otherEffects.js')
importScripts('delaunatormin.js')
importScripts('imagefilter.js')
onmessage = function(e) {
  console.log('Message received from main script');
  //e
  //00,01: cWidth,cHeight
  //1: img1;
  //2: completed Filters before already?
  //3: d=pixel density
  //4: color threshold

  //all variables here are seperate
  //console.log('Received Data: ', e.data)
  //Generate art
  
  pixelData= e.data[1];
  //console.log('Received Pixel Data',pixelData)
  cWidth=e.data[0][0];
  cHeight=e.data[0][1];
  d= e.data[3]
  colorThreshold = e.data[4]
  if (e.data[2] == false){
    //checks if a filter has already been done
    completedFilters=true;
    //image(img1,0,0,cWidth,cHeight);
    //filter(GRAY);
    //pixelData must be image grayscale
    copyTo(changePixels3('smooth',pixelData),pixelData)
    //console.log(pixelData);
    copyTo(changePixels3('edge',pixelData),pixelData)

    //console.log("Filtered Pixel Data",pixelData)
    //copyTo(changePixels3('smooth',pixelData),pixelData);
    //copyTo(changePixels3('edge',pixelData),pixelData);
  }
  console.log("complete with filters")
  //must keep redoing filters if pixeldata doesn't transfer to pixel
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
  //return data
  //result
  //0: allVertices
  //1: edgePoints
  //2: filtered pixel data
  var result = [allVertices,edgePoints,pixelData];
  postMessage(result);
}
//Variables needed
//img1, all vertices is new don't need

//after done, erase old colors, set finishedColoring to false;do the display stuff