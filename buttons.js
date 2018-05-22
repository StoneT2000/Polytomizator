$(document).on('ready',function(){
    $("#pointBrush").css("background-color","RGB(140,140,140)")
  console.log("Let's make computer generated art that looks pretty cool...v6")
  $("#displayText").on("click",function(){
    if (displayText == false){
      displayText = true;
      $("#displayText").html("Hide<br>Text<br>");
      $("#displayText").css("background-color","RGB(40,40,40)");
    }
    else {
      displayText = false;
      $("#displayText").html("Show<br>Text<br>");
      $("#displayText").css("background-color","RGB(100,100,100)");
    }
  });
  $("#displayColor").on("click",function(){
    if (noColors==true){
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
  $("#displayAnchors").on("click",function(){
    if (displayAnchors == false){
      displayAnchors = true;
      $("#displayAnchors").html("Hide<br>Anchors<br>");
      $("#displayAnchors").css("background-color","RGB(40,40,40)");
      
    }
    else {
      displayAnchors = false;
      $("#displayAnchors").html("Show<br>Anchors<br>");
      $("#displayAnchors").css("background-color","RGB(100,100,100)");
    }
  });
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
  $("#displayCurves").on("click",function(){
    if (displayCurves == false){
      displayCurves = true;
      $("#displayCurves").html("Hide<br>Curves<br>");
      $("#displayCurves").css("background-color","RGB(40,40,40)");
      
    }
    else {
      displayCurves = false;
      $("#displayCurves").html("Show<br>Curves<br>");
      $("#displayCurves").css("background-color","RGB(100,100,100)");
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
  $("#displayAll").on("click",function(){
    if (displayText==false&&
    displayCurves==false&&
    displayPoints==false&&
    displayAnchors==false&&
    displayImage ==false){
      displayText=true;
      displayCurves=true;
      displayPoints=true;
      displayAnchors=true;
      displayImage =true;
      $("#displayText").html("Hide<br>Text<br>");
      $("#displayText").css("background-color","RGB(40,40,40)");
      $("#displayAnchors").html("Hide<br>Anchors<br>");
      $("#displayAnchors").css("background-color","RGB(40,40,40)");
            $("#displayPoints").html("Hide<br>Points<br>");
      $("#displayPoints").css("background-color","RGB(40,40,40)");
            $("#displayCurves").html("Hide<br>Curves<br>");
      $("#displayCurves").css("background-color","RGB(40,40,40)");

      $("#displayImage").html("Hide<br>Image<br>");
      $("#displayImage").css("background-color","RGB(40,40,40)");
    }
    else {
      displayText=false;
      displayCurves=false;
      displayPoints=false;
      displayAnchors=false;
      displayImage =false;
      $("#displayText").html("Show<br>Text<br>");
      $("#displayText").css("background-color","RGB(100,100,100)");
      $("#displayAnchors").html("Show<br>Anchors<br>");
      $("#displayAnchors").css("background-color","RGB(100,100,100)");
      $("#displayPoints").html("Show<br>Points<br>");
      $("#displayPoints").css("background-color","RGB(100,100,100)");
      $("#displayCurves").html("Show<br>Curves<br>");
      $("#displayCurves").css("background-color","RGB(100,100,100)");
      $("#displayImage").html("Show<br>Image<br>");
      $("#displayImage").css("background-color","RGB(100,100,100)");
    }
  });
  $("#colorMap").on("click",function(){
    if (colorMap == false){
      colorMap= true;
      $("#colorMap").text("Coloring Map: On (M)")
    }
    else {
      colorMap = false;
      $("#colorMap").text("Coloring Map: Off (M)")
    }
  })
  $("#brushSize").on("focusout",function(){

    brushSize = parseInt(document.querySelector('#brushSize').value);
    if (isNaN(brushSize) === true || brushSize <1){
      alert("Type in a number larger than 0 for brush size");
    }
    console.log(brushSize);
  });
  $("#brushDensity").on("focusout",function(){

    pointDensity = parseInt(document.querySelector('#brushDensity').value);
    if (isNaN(pointDensity) === true || pointDensity <1){
      alert("Type in a number larger than 0 for brush density");
    }
    console.log(brushSize);
  });
  $("#pointBrush").on("click",function(){
    mode=1;
    $("#pointBrush").css("background-color","RGB(140,140,140)")
    $("#lineBrush").css("background-color","")
    $("#eraser").css("background-color","")
  })
  $("#lineBrush").on("click",function(){
    mode = 2;
    $("#lineBrush").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#eraser").css("background-color","")
  })
  $("#eraser").on("click",function(){
    mode =3;
    $("#eraser").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
    $("#lineBrush").css("background-color","")
  })
  $("#file").on('change',function(){
    img1 = loadImage(window.URL.createObjectURL(document.getElementById("file").files[0]),function(){
      if (img1.width*img1.height>800000){
        var factor = sqrt(img1.width*img1.height/800000);
        cWidth = round(img1.width/factor);
        cHeight = round(img1.height/factor);
        myCanvas =createCanvas(cWidth,cHeight);
        
      }
      else {
        myCanvas =createCanvas(img1.width,img1.height);
        cWidth = img1.width;
        cHeight = img1.height;
      }
      $("#gamedisplay").css("right",(cWidth/2).toString()+"px")
      $("body").css("width",(cWidth+500).toString()+"px")
      $("body").css("height",(cHeight+400).toString()+"px")
      myCanvas.parent('gamedisplay');

      allVertices=[];
      triangulations = [0];
      tColors = [];
      verticesHashTable=[];
      verticesHashTableFlat=[];
      previousData =[];
      dataPos = 0;
      d = pixelDensity();
       
      cWidth--;
      cHeight--;
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

      cWidth++;
      cHeight++;
      generateHashSpace();
      
        
      previousData.push([allVertices.slice(),triangulations.slice(),tColors.slice(),verticesHashTable.slice(),verticesHashTableFlat.slice()]);
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
  })
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