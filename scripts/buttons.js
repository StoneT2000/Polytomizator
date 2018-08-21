var completedFilters = false;
$(document).on('ready', function () {

  document.addEventListener("keydown", function (zEvent) {
    if (zEvent.metaKey && zEvent.shiftKey && zEvent.code === "KeyZ") {
      redo();
    }
    if (zEvent.metaKey && zEvent.shiftKey == false && zEvent.code === "KeyZ") {
      undo();
    }
  });
  $("#pointBrush").css("background-color", "RGB(140,140,140)")
  console.log("Polytomizator v42")
  $("#displayColor").on("click", function () {
    if (noColors === true) {
      noColors = false;
      css_buttons.displayColor(true);

    } else {
      noColors = true;
      css_buttons.displayColor(false);
    }
    for (j = 0; j < triangulations.length; j++) {
      delaunayDisplay(triangulations[j], triangleCanvasLayer);
    }
  })

  $("#displayPoints").on("click", function () {
    if (displayPoints == false) {
      displayPoints = true;
      css_buttons.displayPoints(true);

    } else {
      displayPoints = false;
      css_buttons.displayPoints(false);
    }
  });

  $("#displayTriangulation").on("click", function () {
    if (displayTriangulation == false) {
      displayTriangulation = true;
      css_buttons.displayTriangulation(true);

    } else {
      displayTriangulation = false;
      css_buttons.displayTriangulation(false);
    }
  });
  $("#displayImage").on("click", function () {
    if (displayImage == false) {
      displayImage = true;
      css_buttons.displayImage(true);

    } else {
      displayImage = false;
      css_buttons.displayImage(false);
    }
  });
  $("#brushSize").on("focusout", function () {

    var brushSizeTemp = parseInt(document.querySelector('#brushSize').value);
    if (isNaN(brushSizeTemp) === true || brushSizeTemp < 1) {
      alert("Type in a number larger than 0 for brush size");
      $("#brushSize")[0].value = brushSize;
    } else {
      brushSize = brushSizeTemp
    }
  });
  $("#brushDensity").on("focusout", function () {

    var pointDensityTemp = parseInt(document.querySelector('#brushDensity').value) - 1;
    if (isNaN(pointDensityTemp) === true || pointDensityTemp < 1) {
      alert("Type in a number larger than 1 for brush density");
      $("#brushDensity")[0].value = pointDensity + 1;
    } else {
      pointDensity = pointDensityTemp;
    }
  });

  $("#colorThreshold").on("focusout", function () {
    var colorThresholdTemp = parseInt(document.querySelector('#colorThreshold').value);
    if (isNaN(colorThresholdTemp) === true || colorThresholdTemp < 1) {
      alert("Type in a number larger than 1 for color threshold");
      $("#colorThreshold")[0].value = colorThreshold;
    } else {
      colorThreshold = colorThresholdTemp;
      //resetAutoGenListener([cWidth, cHeight, completedFilters, d, colorThreshold], artstyle);
    }
  })
  $("#durationOfFlowerEffect").on("focusout", function () {
    var flowerEffectTimeTemp = parseInt(document.querySelector('#durationOfFlowerEffect').value);
    if (isNaN(flowerEffectTimeTemp) === true || flowerEffectTimeTemp < 1) {
      alert("Type in a number larger than 1 for effect duration");
    } else {
      flowerEffectTime = flowerEffectTimeTemp;
    }
  })
  $("#flowerEffect").on("click", function () {
    if (flowerEffect === false) {
      flowerEffect = true;
      $("#flowerEffect").text("Instant Coloring: Off")
      $("#durationOfFlowerEffect").css("z-index", "0");
      $("#flowerEffectTime").css("transform", "translate(0,0)");
      $("#durationOfFlowerEffect").css("transform", "translate(0,0)");
    } else {
      flowerEffect = false;
      $("#flowerEffect").text("Instant Coloring: On")

      $("#flowerEffectTime").css("transform", "translate(0,-39px)");
      $("#durationOfFlowerEffect").css("z-index", "-5");
      $("#durationOfFlowerEffect").css("transform", "translate(0,-75px)");
    }

  })
  $("#pointBrush").on("click", function () {
    mode = 1;
    $("#pointBrush").css("background-color", "RGB(140,140,140)")
    $("#lineBrush").css("background-color", "")
    $("#eraser").css("background-color", "")
    $("#triangleMover").css("background-color", "")
  })
  $("#lineBrush").on("click", function () {
    mode = 2;
    $("#lineBrush").css("background-color", "RGB(140,140,140)")
    $("#pointBrush").css("background-color", "")
    $("#eraser").css("background-color", "")
    $("#triangleMover").css("background-color", "")
  })
  $("#eraser").on("click", function () {
    mode = 3;
    $("#eraser").css("background-color", "RGB(140,140,140)")
    $("#pointBrush").css("background-color", "")
    $("#lineBrush").css("background-color", "")
    $("#triangleMover").css("background-color", "")
  })
  $("#triangleMover").on("click", function () {
    mode = 4;
    $("#triangleMover").css("background-color", "RGB(140,140,140)")
    $("#pointBrush").css("background-color", "")
    $("#lineBrush").css("background-color", "")
    $("#eraser").css("background-color", "")
  });
  $("#file").on('change', function () {
    completedFilters = false;
    img1 = loadImage(window.URL.createObjectURL(document.getElementById("file").files[0]), function () {
      //make image have height 600
      var factor = img1.height / 620;
      cWidth = round(img1.width / factor);
      cHeight = round(img1.height / factor);
      if (cWidth > window.innerWidth * 0.9) {
        var factor = img1.width / (window.innerWidth * 0.9);
        cWidth = round(img1.width / factor);
        cHeight = round(img1.height / factor);
      }
      //makes sure we have proper hashing for those images that have perfect grid alignments

      //Temporary fix for when width is 0 mod 50, the hashmap doesn't work.
      if (cWidth % 50 == 0) {
        cWidth++;
      }
      if (cHeight % 50 == 0) {
        cHeight++;
      }
      myCanvas = createCanvas(cWidth, cHeight);

      $("#gamedisplay").css("right", (cWidth / 2).toString() + "px")
      //$("body").css("width",(cWidth+500).toString()+"px")

      myCanvas.parent('gamedisplay');

      allVertices = [];
      triangulations = [0];
      tColors = [];
      verticesHashTable = [];
      verticesHashTableFlat = [];
      d = pixelDensity();
      allVertices.push([0, 0]);
      allVertices.push([cWidth, 0]);
      allVertices.push([0, cHeight]);
      allVertices.push([cWidth, cHeight]);

      for (i = 0; i < cWidth / 80; i++) {
        var tempv = i * 80 + round(random(0, 30));
        var tempv2 = i * 80 + round(random(0, 30));
        if (inCanvas(tempv, cHeight)) {
          allVertices.push([tempv, cHeight])
        }
        if (inCanvas(tempv2, cHeight)) {
          allVertices.push([tempv2, 0])
        }


      }
      for (i = 0; i < cHeight / 80; i++) {
        var tempv = i * 80 + round(random(0, 30));
        var tempv2 = i * 80 + round(random(0, 30));
        if (inCanvas(cWidth, tempv)) {
          allVertices.push([cWidth, tempv])
        }
        if (inCanvas(0, tempv2)) {
          allVertices.push([0, tempv2])
        }

      }
      finishedColoring = true;

      generateHashSpace();
      image(img1, 0, 0, cWidth, cHeight);
      loadPixels();
      filteredPixels = [];
      //resetAutoGenListener([cWidth, cHeight, completedFilters, d, colorThreshold], artstyle);

      storedVertices = [];
      for (var slot_index = 0; slot_index < max_undo; slot_index++) {
        storedVertices.push([]);
      }

      triangleCanvasLayer = createGraphics(cWidth, cHeight)

      //Store initial vertices
      recordVertices();
    });

  });
  $("#expandImage").on("click", function () {
    if (finishedColoring == false) {
      alert("Please wait until the coloring is finished before enlargining the work and downloading it")
    } else {
      if (window.confirm("Are you sure you want to do this? You cannot go back and edit this work again.")) {
        var factor = 2;
        if (cWidth > cHeight) {
          factor = ceil(6000 / cWidth);
        } else {
          factor = ceil(6000 / cHeight);
        }

        expandImage(factor, true);
      }
    }
  });
  $("#polytomize").on("click", function () {
    triangulize();
    finishedColoring = false;
    image(img1, 0, 0, cWidth, cHeight);

    loadPixels();
    tColors = [];
    sTime = millis();
    css_buttons.displayPoints(false);
    displayPoints = false;
  })

  //Save or load vertices
  $("#saveThis").on("click", function () {
    saveData();
    $("#saveThis").text("Saved data!");
    window.setTimeout(function () {
      $("#saveThis").text("Save this canvas");
    }, 2000)
  });
  $("#loadThis").on("click", function () {
    loadData(JSON.parse(localStorage.getItem("art1")))
    $("#loadThis").text("Loaded Data!");
    window.setTimeout(function () {
      $("#loadThis").text("Load last saved");
    }, 2000)
  });

  //options menu

  $("#options_menu_gear").on("click", function () {
    display_options();
  });
  
  //Functions in options menu
  $("#displaygencubicpoly").on("click", function(){
    open_a_options()
    display_options(false);
    $("#options_menu_additional").html("<h4>Generate cubic poly art</h4><i id=\"close_a_options\"class=\"fa fa-times\"></i><span>Accuracy</span><input class=\"parameters\" type=\"text\" placeholder=\"≥ 10\" id=\"gencubicpoly_accuracy\"><span>Density</span><input class=\"parameters\" type=\"text\" placeholder=\"0 ~ 1\" id=\"gencubicpoly_density\"><button id=\"gencubicpoly\">Generate</button>");
    $("#gencubicpoly").on("click", function(){
      var cpdensity = parseFloat($("#gencubicpoly_density").val());
      var cpaccuracy = parseInt($("#gencubicpoly_accuracy").val());
      if (isNaN(cpdensity) || cpdensity < 0 || cpdensity > 1){
        alert("Enter a decimal value between 0 and 1 for density");
        return;
      }
      if (isNaN(cpaccuracy) || cpaccuracy <= 0){
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      if (cpaccuracy != parseFloat($("#gencubicpoly_accuracy").val())){
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      //This accuracy is actaully half what actaully is represented
      generateCubicPoly(cpaccuracy * 2, cpdensity)
      close_a_options();
    })
    $("#close_a_options").on("click", function(){
      close_a_options();
    });
  });
  
  $("#displaysnapvertices").on("click", function(){
    open_a_options()
    display_options(false);
    $("#options_menu_additional").html("<h4>Snap visible vertices to a grid</h4><i id=\"close_a_options\"class=\"fa fa-times\"></i><span>Accuracy</span><input class=\"parameters\" type=\"text\" placeholder=\"≥ 10\" id=\"snapping_accuracy\"><button id=\"snap_vertices\">Snap</button>");
    $("#snap_vertices").on("click", function(){
      var spaccuracy = parseInt($("#snapping_accuracy").val());
      if (isNaN(spaccuracy) || spaccuracy <= 0){
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      if (spaccuracy != parseFloat($("#snapping_accuracy").val())){
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      snapVertices(2 * spaccuracy)
      close_a_options();
    })
    $("#close_a_options").on("click", function(){
      close_a_options();
    });
  });
  $("#displaygennormalpoly").on("click", function(){
    open_a_options()
    display_options(false);
    $("#options_menu_additional").html("<h4>Generate poly art</h4><i id=\"close_a_options\"class=\"fa fa-times\"></i><span>Color Threshold</span><input class=\"parameters\" type=\"text\" placeholder=\"10 ~ 255\" id=\"color_threshold\"><button id=\"gennormalpoly\">Generate</button>");
    $("#gennormalpoly").on("click", function(){
      var ct = parseFloat($("#color_threshold").val());
      if (isNaN(ct) || ct < 10){
        alert("Enter a number larger than 10 for the color threshold");
        return;
      }
      colorThreshold = ct;
      close_a_options();
      generate_normal_poly([cWidth, cHeight, completedFilters, d, colorThreshold]);
      
    })
    $("#close_a_options").on("click", function(){
      close_a_options();
    });
  });
  
  $("#snapping").on("change", function () {
    //console.log($("#snapping")[0].checked);
    if ($("#snapping")[0].checked) {
      snapping = true;
    }
  });

})
var options_menu_open = false;
function display_options(value) {
  if (value) {
    if (value === true) {
      $("#options_menu").css("display", "block");
      window.setTimeout(function () {
        $("#options_menu").css("opacity", "1")
      }, 1);
    } else {
      window.setTimeout(function () {
        $("#options_menu").css("display", "none");
      }, 200);
      $("#options_menu").css("opacity", "0");
      options_menu_open = false;
    }
  }
  if (options_menu_open === false) {
    $("#options_menu").css("display", "block");
    window.setTimeout(function () {
      $("#options_menu").css("opacity", "1")
    }, 1);
    options_menu_open = true;
  } else {
    window.setTimeout(function () {
      $("#options_menu").css("display", "none");
    }, 200);
    $("#options_menu").css("opacity", "0");
    options_menu_open = false;

  }
}

//a=additional
function open_a_options(){
  $("#options_menu_additional").css("display", "block");
}
function close_a_options(){
  $("#options_menu_additional").css("display", "none");
}