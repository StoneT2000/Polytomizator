$(document).on('ready',function(){
  var hovertime;
  function hoverEnterText(id,topValue,text){
    hovertime = window.setTimeout(function(){
      $("#popUp").css("display","block");
      $("#popUp").text(text);
      $("#popUp").css("top",topValue);

    },300)
    
  }
  $("#pointBrush").mouseenter(function(){
    hoverEnterText('#pointbrush','50','Point Brush (P): Click to add individual points');
  })
  $("#pointBrush,#lineBrush,#eraser,#expandImage,#saveThis,#loadThis,#triangleMover,#sizing2,#sizing1,#flowerEffect,#duration").mouseleave(function(){
    noPopUp();
  })
  $("#lineBrush").mouseenter(function(){
    hoverEnterText('#lineBrush','110','Line Brush (B): Click or drag to add scattered points at the current brush size');
  })
  $("#eraser").mouseenter(function(){
    hoverEnterText('#eraser','170','Eraser (E): Erase what you don\'t want');
  })
  $("#triangleMover").mouseenter(function(){
    hoverEnterText('#eraser','230','Triangle Flipper (T): Remove or re-add triangles');
  })
  $("#sizing1").mouseenter(function(){
    hoverEnterText('#sizing','290','Adjust radius of line brush');
  })
  $("#sizing2").mouseenter(function(){
    hoverEnterText('#sizing','400','Adjust density of brush');
  })
  $("#saveThis").mouseenter(function(){
    hoverEnterText('#saveThis','510','Save the canvas for next time');
  })
  $("#loadThis").mouseenter(function(){
    hoverEnterText('#loadThis','570','Load the last canvas saved');
  })
  $("#flowerEffect").mouseenter(function(){
    hovertime = window.setTimeout(function(){
      $("#popUp2").css("display","block");
    },300)
  })
  $("#flowerEffect").mouseleave(function(){
    $("#popUp2").css("display","none");
  })
  function noPopUp(){
     $("#popUp").css("display","none");
     clearTimeout(hovertime);
  }
  
});