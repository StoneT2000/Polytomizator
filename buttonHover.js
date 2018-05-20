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
    hoverEnterText('#pointbrush','50','Point Brush: Click to add individual points');
  })
  $("#pointBrush").mouseleave(function(){
    noPopUp();
   
  })
  $("#lineBrush").mouseenter(function(){
    hoverEnterText('#lineBrush','100','Line Brush: Click or drag to add scattered points at the current brush size');
  })
  $("#lineBrush").mouseleave(function(){
    noPopUp();
   
  })
  $("#sizing").mouseenter(function(){
    hoverEnterText('#sizing','200','Adjust radius of line brush');
  })
  $("#sizing").mouseleave(function(){
    noPopUp();
  })
  $("#expandImage").mouseenter(function(){
    hoverEnterText('#expandImage','300','Download the current image at a higher resolution');
  })
  $("#expandImage").mouseleave(function(){
    noPopUp();
  })
  $("#saveThis").mouseenter(function(){
    hoverEnterText('#saveThis','400','Save the set of points drawn');
  })
  $("#saveThis").mouseleave(function(){
    noPopUp();
  })
  $("#loadThis").mouseenter(function(){
    hoverEnterText('#loadThis','450','Load the last set of points saved');
  })
  $("#loadThis").mouseleave(function(){
    noPopUp();
  })

  function noPopUp(){
     $("#popUp").css("display","none");
     clearTimeout(hovertime);
  }
  
});