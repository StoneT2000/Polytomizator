var completedFilters = false;
$(document).on('ready',function(){
  
  $("#pointBrush").css("background-color","RGB(140,140,140)")
  console.log("Let's make computer generated art that looks pretty cool...v33")
  $("#displayColor").on("click",function(){
    if (noColors===true){
      noColors = false;
      $("#displayColor").html("Hide <br>Colors<br>")
      $("#displayColor").css("background-color","RGB(40,40,40)");
    }
    else {
      $("#displayColor").html("Show <br>Colors<br>")
      noColors = true;
      $("#displayColor").css("background-color","RGB(100,100,100)");
    }
  })

  $("#displayPoints").on("click",function(){
    if (displayPoints == false){
      displayPoints = true;
            $("#displayPoints").html("Hide<br>Points<br>");
      $("#displayPoints").css("background-color","RGB(40,40,40)");

    }
    else {
      displayPoints = false;
            $("#displayPoints").html("Show<br>Points<br>");
      $("#displayPoints").css("background-color","RGB(100,100,100)");
    }
  });

  $("#displayTriangulation").on("click",function(){
    if (displayTriangulation == false){
      displayTriangulation = true;
      $("#displayTriangulation").html("Hide<br>Triangles<br>");
      $("#displayTriangulation").css("background-color","RGB(40,40,40)");
      
    }
    else {
      displayTriangulation = false;
      $("#displayTriangulation").html("Show<br>Triangles<br>");
      $("#displayTriangulation").css("background-color","RGB(100,100,100)");
    }
  });
  $("#displayImage").on("click",function(){
    if (displayImage == false){
      displayImage = true;
      $("#displayImage").html("Hide<br>Image<br>");
      $("#displayImage").css("background-color","RGB(40,40,40)");
      
    }
    else {
      displayImage = false;
      $("#displayImage").html("Show<br>Image<br>");
      $("#displayImage").css("background-color","RGB(100,100,100)");
    }
  });
  $("#brushSize").on("focusout",function(){

    var brushSizeTemp = parseInt(document.querySelector('#brushSize').value);
    if (isNaN(brushSizeTemp) === true || brushSizeTemp <1){
      alert("Type in a number larger than 0 for brush size");
      $("#brushSize")[0].value = brushSize;
    }
    else {
      brushSize = brushSizeTemp
    }
  });
  $("#brushDensity").on("focusout",function(){

    var pointDensityTemp = parseInt(document.querySelector('#brushDensity').value)-1;
    if (isNaN(pointDensityTemp) === true || pointDensityTemp <1){
      alert("Type in a number larger than 1 for brush density");
      $("#brushDensity")[0].value = pointDensity+1;
    }
    else{
      pointDensity = pointDensityTemp;
    }
  });
  
  $("#colorThreshold").on("focusout",function(){
    var colorThresholdTemp = parseInt(document.querySelector('#colorThreshold').value);
    if (isNaN(colorThresholdTemp) === true || colorThresholdTemp <1){
      alert("Type in a number larger than 1 for color threshold");
      $("#colorThreshold")[0].value = colorThreshold;
    }
    else{
      colorThreshold = colorThresholdTemp;
      resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold],artstyle);
    }
  })
  $("#durationOfFlowerEffect").on("focusout",function(){
    var flowerEffectTimeTemp = parseInt(document.querySelector('#durationOfFlowerEffect').value);
    if (isNaN(flowerEffectTimeTemp) === true || flowerEffectTimeTemp <1){
      alert("Type in a number larger than 1 for effect duration");
    }
    else{
      flowerEffectTime = flowerEffectTimeTemp;
    }
  })
  $("#flowerEffect").on("click",function(){
    if (flowerEffect === false){
      flowerEffect = true;
      $("#flowerEffect").text("Instant Coloring: Off")
      $("#durationOfFlowerEffect").css("z-index","0");
      $("#flowerEffectTime").css("transform","translate(0,0)");
      $("#durationOfFlowerEffect").css("transform","translate(0,0)");
    }
    else {
      flowerEffect = false;
      $("#flowerEffect").text("Instant Coloring: On")
      
      $("#flowerEffectTime").css("transform","translate(0,-39px)");
      $("#durationOfFlowerEffect").css("z-index","-5");
      $("#durationOfFlowerEffect").css("transform","translate(0,-75px)");
    }
    
  })
  $("#pointBrush").on("click",function(){
    mode=1;
    $("#pointBrush").css("background-color","RGB(140,140,140)")
    $("#lineBrush").css("background-color","")
    $("#eraser").css("background-color","")
    $("#triangleMover").css("background-color","")
  })
  $("#lineBrush").on("click",function(){
    mode = 2;
    $("#lineBrush").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#eraser").css("background-color","")
    $("#triangleMover").css("background-color","")
  })
  $("#eraser").on("click",function(){
    mode =3;
    $("#eraser").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#lineBrush").css("background-color","")
    $("#triangleMover").css("background-color","")
  })
  $("#triangleMover").on("click",function(){
    mode = 4;
    $("#triangleMover").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#lineBrush").css("background-color","")
    $("#eraser").css("background-color","")
  });
  $("#file").on('change',function(){
    completedFilters=false;
    img1 = loadImage(window.URL.createObjectURL(document.getElementById("file").files[0]),function(){
      //make image have height 600
        var factor = img1.height/620;
        cWidth = round(img1.width/factor);
        cHeight = round(img1.height/factor);
      //makes sure we have proper hashing for those images that have perfect grid alignments
        var iterations = 0;
      //Temporary fix for when width is 0 mod 50, the hashmap doesn't work.
        while (cWidth % 50 == 0){
          factor = img1.height/(620+iterations);
          cWidth = round(img1.width/factor);
          cHeight = round(img1.height/factor);
          iterations ++;
          if (iterations >10){
            alert("Please select a different image of slightly different dimensions, this one can't work")
            break;
          }
        }
        myCanvas = createCanvas(cWidth,cHeight);

      $("#gamedisplay").css("right",(cWidth/2).toString()+"px")
      //$("body").css("width",(cWidth+500).toString()+"px")

      myCanvas.parent('gamedisplay');

      allVertices=[];
      triangulations = [0];
      tColors = [];
      verticesHashTable=[];
      verticesHashTableFlat=[];
      d = pixelDensity();
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
      finishedColoring=true;

      generateHashSpace();
      image(img1,0,0,cWidth,cHeight);
      loadPixels();
      filteredPixels=[];
      resetAutoGenListener([cWidth,cHeight,completedFilters,d,colorThreshold],artstyle);
    });
    
  });
  $("#expandImage").on("click",function(){
    if (finishedColoring == false){
      alert("Please wait until the coloring is finished before enlargining the work and downloading it")
    }
    else {
      if (window.confirm("Are you sure you want to do this? You cannot go back and edit this work again.")){
        var factor = 2;
        if (cWidth>cHeight){
          factor = ceil(6000/cWidth);
        }
        else {
          factor = ceil(6000/cHeight);
        }
        
        expandImage(factor,true);
      }
    }
  });
  $("#polytomize").on("click",function(){
    triangulize();
    finishedColoring = false;
    image(img1,0,0,cWidth,cHeight);

    loadPixels();
    tColors=[];
    sTime = millis();
    $("#displayPoints").html("Show<br>Points<br>");
    $("#displayPoints").css("background-color","RGB(100,100,100)");
    displayPoints=false;
  })
  
  //Save or load vertices
  $("#saveThis").on("click",function(){
    saveData();
    $("#saveThis").text("Saved data!");
    window.setTimeout(function(){
      $("#saveThis").text("Save this canvas");
    },2000)
  });
  $("#loadThis").on("click",function(){
    loadData(JSON.parse(localStorage.getItem("art1")))
    $("#loadThis").text("Loaded Data!");
    window.setTimeout(function(){
      $("#loadThis").text("Load last saved");
    },2000)
  });
  

})