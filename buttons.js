$(document).on('ready',function(){
  console.log("Let's make computer generated art that looks pretty cool")
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
      $("#colorMap").text("Coloring Map: On (Press M to switch)")
    }
    else {
      colorMap = false;
      $("#colorMap").text("Coloring Map: Off (Press M to switch)")
    }
  })
  $("#brushSize").on("focusout",function(){

    brushSize = parseInt(document.querySelector('#brushSize').value);
  });
  $("#pointBrush").on("click",function(){
    mode=1;
    $("#pointBrush").css("background-color","RGB(140,140,140)")
    $("#lineBrush").css("background-color","")
  })
  $("#lineBrush").on("click",function(){
    mode = 2;
    $("#lineBrush").css("background-color","RGB(140,140,140)")
    $("#pointBrush").css("background-color","")
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
       vertices = [];
       curves = [];
       totalPointsOnCurve = [];
       bPoints = [];
      oPoints = [];
      allVertices=[];
       triangulations = [0];
       tColors = [];
       nPoints =[];
       previousData =[];
       dataPos = 0;
      d = pixelDensity();
      allVertices.push([1,1]);
      allVertices.push([cWidth-1,1]);
      allVertices.push([1,cHeight-1]);
      allVertices.push([cWidth-1,cHeight-1]);
      for(i=0;i<cWidth/80;i++){
        allVertices.push([i*80+round(random(-30,30)),cHeight-1])
        allVertices.push([i*80+round(random(-30,30)),1])
      }
      for(i=0;i<cHeight/80;i++){
        allVertices.push([cWidth-1,i*80+round(random(-30,30))])
        allVertices.push([1,i*80+round(random(-30,30))])
      }
    });
    
  });

})