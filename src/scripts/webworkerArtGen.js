importScripts('poly_helper.js')
importScripts('otherEffects.js')
importScripts('delaunatormin.js')
importScripts('imagefilter.js')
onmessage = function (e) {
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

  pixelData = e.data[1];
  //console.log('Received Pixel Data',pixelData)
  cWidth = e.data[0][0];
  cHeight = e.data[0][1];
  d = e.data[3]
  colorThreshold = e.data[4]
  if (e.data[2] == false) {
    //checks if a filter has already been done
    completedFilters = true;
    //image(img1,0,0,cWidth,cHeight);
    //filter(GRAY);
    //pixelData must be image grayscale
    copyTo(changePixels3('smooth', pixelData), pixelData)
    //console.log(pixelData);
    copyTo(changePixels3('edge', pixelData), pixelData)

    //console.log("Filtered Pixel Data",pixelData)
    //copyTo(changePixels3('smooth',pixelData),pixelData);
    //copyTo(changePixels3('edge',pixelData),pixelData);
  }
  console.log("complete with filters")
  //must keep redoing filters if pixeldata doesn't transfer to pixel

  //return data
  //result
  //0: edgePoints, of form [x,y,RGB color values]
  //1: filtered pixel data
  var result = [edgePoints, pixelData];
  postMessage(result);
}
//Variables needed
//img1, all vertices is new don't need

//after done, erase old colors, set finishedColoring to false;do the display stuff