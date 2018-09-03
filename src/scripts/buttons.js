var completedFilters = false;
//Size in MP of downloaded poly art.
var size_megapixels = 22

$(document).ready(function () {
  var confirmed_size_risk = false;
  document.addEventListener("keydown", function (zEvent) {
    if (zEvent.metaKey && zEvent.shiftKey && zEvent.code === "KeyZ") {
      redo();
    }
    if (zEvent.metaKey && zEvent.shiftKey == false && zEvent.code === "KeyZ") {
      undo();
    }
  });
  $("#undo").addClass("disabled");
  $("#redo").addClass("disabled");
  $("#undo").css("cursor", "not-allowed");
  $("#redo").css("cursor", "not-allowed");

  $("#pointBrush").addClass("active");
  console.log("Polytomizator v53")
  
  //Default values
  $("#grid_accuracy").val(20)
  $("#flower_effect_speed").val(1);
  $("#downloaded_poly_size").val(22);
  //Initialize popover stuff
  $(function () {
    $('[data-toggle="popover"]').popover()
  })
  //Initialize tool tips
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  $("#displayColor").on("click", function () {
    if (noColors === true) {
      noColors = false;
      css_buttons.displayColor(true);

    } else {
      noColors = true;
      css_buttons.displayColor(false);
    }
    if (flowerEffect) {

    } else {
      for (j = 0; j < triangulations.length; j++) {
        delaunayDisplay(triangulations[j], triangleCanvasLayer);
      }
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

    }
  })
  $("#pointBrush").on("click", function () {
    mode = 1;
    removeClassFromBrushes("active");
    $("#pointBrush").addClass("active");
  })
  $("#lineBrush").on("click", function () {
    mode = 2;
    removeClassFromBrushes("active");
    $("#lineBrush").addClass("active");
  })
  $("#eraser").on("click", function () {
    mode = 3;
    removeClassFromBrushes("active");
    $("#eraser").addClass("active");
  })
  $("#triangleMover").on("click", function () {
    mode = 4;
    removeClassFromBrushes("active");
    $("#triangleMove").addClass("active");
  });
  $("#file").on('change', function () {
    $('#label_file').text(this.files && this.files.length ? this.files[0].name.split('.')[0] : '');
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
      
      myCanvas = createCanvas(cWidth, cHeight);
      origcWidth = cWidth;
      origcHeight = cHeight;
      canvasScale = 1;
      $("#gamedisplay").css("width", cWidth);
      $("#gamedisplay").css("margin-left", -cWidth/2);

      myCanvas.parent('gamedisplay');

      triangulations = [0];
      tColors = [];
      verticesHashTable = [];
      triangulatedVerticesFlat = [];
      verticesHashTableFlat = [];
      d = pixelDensity();
      storedVertices = [];
      for (var slot_index = 0; slot_index < max_undo; slot_index++) {
        storedVertices.push([0,0]);
      }
      generateHashSpace();
      recordVertices();
      updateHashSpace(0, 0, true)
      updateHashSpace(cWidth, 0, true)
      updateHashSpace(0, cHeight, true)
      updateHashSpace(cWidth, cHeight, true)
      for (i = 0; i < cWidth / 80; i++) {
        var tempv = i * 80 + round(random(0, 30));
        var tempv2 = i * 80 + round(random(0, 30));
        if (inCanvas(tempv, cHeight)) {
          updateHashSpace(tempv, cHeight, true)
        }
        if (inCanvas(tempv2, 0)) {
          updateHashSpace(tempv2, 0, true);
        }


      }
      for (var i = 0; i < cHeight / 80; i++) {
        var tempv = i * 80 + round(random(0, 30));
        var tempv2 = i * 80 + round(random(0, 30));
        if (inCanvas(cWidth, tempv)) {
          updateHashSpace(cWidth, tempv, true);
        }
        if (inCanvas(0, tempv2)) {
          updateHashSpace(0, tempv2, true);
        }


      }
      finishedColoring = true;

      //generateHashSpace();
      image(img1, 0, 0, cWidth, cHeight);
      loadPixels();
      filteredPixels = [];
      //resetAutoGenListener([cWidth, cHeight, completedFilters, d, colorThreshold], artstyle);

      triangleCanvasLayer = createGraphics(cWidth, cHeight)

      //Store initial vertices
      recordVertices();
    });

  });
  $("#expandImage").on("click", function () {

    if (finishedColoring == false) {
      alert("Please wait until the coloring is finished before downloading it")
    } else {
      var factor = 2;
      
      var current_canvas_area = cWidth * cHeight;
      var factor = sqrt(pow(2,20) * size_megapixels / current_canvas_area);
      /*
      if (cWidth > cHeight) {
        factor = ceil(6000 / cWidth);
      } else {
        factor = ceil(6000 / cHeight);
      }
      */

      expandImage(factor, true);
    }
  });
  $("#polytomize").on("click", function () {

    //Should be the exact same as pressing the D key
    triangulate_and_display();
  })

  //Save or load vertices
  $("#saveThis").on("click", function () {
    saveData();
    $("#saveThis").html("Saved<br>data!");
    window.setTimeout(function () {
      $("#saveThis").html("Save this<br>canvas");
    }, 2000)
  });
  $("#loadThis").on("click", function () {
    loadData(JSON.parse(localStorage.getItem("art1")))
    $("#loadThis").html("Loaded<br>Data!");
    window.setTimeout(function () {
      $("#loadThis").html("Load last<br>canvas");
    }, 2000)
  });

  //options menu

  $("#options_menu_gear").on("click", function () {
    display_options();
  });

  //Functions in options menu... These can probably be optomized
  $("#displaygencubicpoly").on("click", function () {
    open_a_options()
    display_options(false);
    $("#options_menu_additional").html("<h4>Generate cubic poly art</h4><i id=\"close_a_options\"class=\"fa fa-times\"></i><span>Accuracy</span><input class=\"parameters form-control\" type=\"text\" placeholder=\"≥ 10\" id=\"gencubicpoly_accuracy\"><span>Density</span><input class=\"parameters form-control\" type=\"text\" placeholder=\"0 ~ 1\" id=\"gencubicpoly_density\"><button class=\"btn btn-outline-light\" id=\"gencubicpoly\">Generate</button>");
    $("#gencubicpoly").on("click", function () {
      var cpdensity = parseFloat($("#gencubicpoly_density").val());
      var cpaccuracy = parseInt($("#gencubicpoly_accuracy").val());
      if (isNaN(cpdensity) || cpdensity < 0 || cpdensity > 1) {
        alert("Enter a decimal value between 0 and 1 for density");
        return;
      }
      if (isNaN(cpaccuracy) || cpaccuracy <= 0) {
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      if (cpaccuracy != parseFloat($("#gencubicpoly_accuracy").val())) {
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      //This accuracy is actaully half what actaully is represented
      generateCubicPoly(cpaccuracy * 2, cpdensity)
      close_a_options();
    })
    $("#close_a_options").on("click", function () {
      close_a_options();
    });
  });

  $("#displaysnapvertices").on("click", function () {
    open_a_options()
    display_options(false);
    $("#options_menu_additional").html("<h4>Snap visible vertices to a grid</h4><i id=\"close_a_options\"class=\"fa fa-times\"></i><span>Accuracy</span><input class=\"parameters form-control\" type=\"text\" placeholder=\"≥ 10\" id=\"snapping_accuracy\"><button class=\"btn btn-outline-light\" id=\"snap_vertices\">Snap</button>");
    $("#snap_vertices").on("click", function () {
      var spaccuracy = parseInt($("#snapping_accuracy").val());
      if (isNaN(spaccuracy) || spaccuracy <= 0) {
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      if (spaccuracy != parseFloat($("#snapping_accuracy").val())) {
        alert("Enter a integer larger than 0 for accuracy");
        return;
      }
      snapVertices(2 * spaccuracy)
      close_a_options();
    })
    $("#close_a_options").on("click", function () {
      close_a_options();
    });
  });
  $("#displaygennormalpoly").on("click", function () {
    open_a_options()
    display_options(false);
    $("#options_menu_additional").html("<h4>Generate poly art</h4><i id=\"close_a_options\"class=\"fa fa-times\"></i><span>Color Threshold</span><input class=\"parameters form-control\" type=\"text\" placeholder=\"10 ~ 255\" id=\"color_threshold\"><button class=\"btn btn-outline-light\" id=\"gennormalpoly\">Generate</button>");
    $("#gennormalpoly").on("click", function () {
      var ct = parseFloat($("#color_threshold").val());
      if (isNaN(ct) || ct < 10) {
        alert("Enter a number larger than 10 for the color threshold");
        return;
      }
      var canvas_area = cWidth*cHeight
      if (canvas_area > 3000000) {
        var predicted_time = 1.013 * pow(10, -5) * canvas_area
        var proceed_or_not = confirm("The canvas size is rather large and this process will take approximately " + predicted_time.toFixed(2) + " seconds");
        if (!proceed_or_not){
          return;
        }
      }
      colorThreshold = ct;
      close_a_options();
      generate_normal_poly([cWidth, cHeight, completedFilters, d, colorThreshold]);

    })
    $("#close_a_options").on("click", function () {
      close_a_options();
    });
  });

  $("#snapping").on("change", function () {
    //console.log($("#snapping")[0].checked);
    if ($("#snapping")[0].checked) {
      snapping = true;
    } else {
      snapping = false;
    }
  });
  $("#display_grid").on("change", function () {
    //console.log($("#snapping")[0].checked);
    if ($("#display_grid")[0].checked) {
      display_grid = true;
    } else {
      display_grid = false;
    }
  });
  $("#grid_accuracy").on("change", function () {
    var newacc = parseInt($("#grid_accuracy").val());
    if (isNaN(newacc) || newacc < 2) {
      alert("Enter a integer more than 1 for grid accuracy")
      $("#grid_accuracy").val(snappingAccuracy);
      return;
    }
    snappingAccuracy = newacc;
    $("#grid_accuracy").val(snappingAccuracy);
  });
  $("#flower_effect").on("change", function () {
    if ($("#flower_effect")[0].checked) {
      flowerEffect = true;
    } else {
      flowerEffect = false;
      flowering = false;
    }
  })
  $("#flower_effect_speed").on("change", function () {
    var newspeed = parseInt($("#flower_effect_speed").val());
    if (isNaN(newspeed) || newspeed < 1) {
      alert("Enter a positive integer for flowering speed")
      $("#flower_effect_speed").val(flowering_speed);
      return;
    }
    flowering_speed = newspeed;
    $("#flower_effect_speed").val(newspeed)
  });
  var selected_mode_num = 2;
  $("#display_mode_selection").on("change", function () {
    var selected_mode = $("#display_mode_selection").val();

    if (selected_mode == "circles") {
      selected_mode_num = 2;
    } else if (selected_mode == "rectangles") {
      selected_mode_num = 1;
    } else if (selected_mode == "distorted_triangles") {
      selected_mode_num = 3;
    }
    if (display_mode_on === true) {
      displayMode = selected_mode_num;
      triangulate_and_display();
    }
  });
  $("#display_mode_check").on("change", function () {
    if ($("#display_mode_check")[0].checked) {
      displayMode = selected_mode_num;
      display_mode_on = true;
      triangulate_and_display();
    } else {
      displayMode = 0;
      display_mode_on = false;
      triangulate_and_display();

    }
  });
  $("#stats_mode_check").on("change", function () {
    if ($("#stats_mode_check")[0].checked) {
      $("#stats_for_nerds").css("display", "block");
    } else {
      $("#stats_for_nerds").css("display", "none");
    }
  })
  $("#downloaded_poly_size").on("change", function () {
    var old_size_value = size_megapixels;
    var new_size_value = parseFloat($("#downloaded_poly_size").val());
    if (confirmed_size_risk == false){
      var confirming_size_risk = confirm("Are you sure you want to change this value? If the image size is too high, the poly art may not download correctly. By default, it is set at 22MP");
      if (confirming_size_risk){
        confirmed_size_risk = true;
        if (!isNaN(new_size_value) && new_size_value >= 1) {
          $("#downloaded_poly_size").val(new_size_value);
          size_megapixels = new_size_value;
        }
        else {
          $("#downloaded_poly_size").val(old_size_value);
          alert("Please enter a positive number greater or equal to 1 for image size")
        }
      }
      else {
        $("#downloaded_poly_size").val(old_size_value);
      }
    }
    else {
      if (!isNaN(new_size_value) && new_size_value >= 1) {
        $("#downloaded_poly_size").val(new_size_value);
        size_megapixels = new_size_value;
      }
      else {
        $("#downloaded_poly_size").val(old_size_value);
        alert("Please enter a positive number greater or equal to 1 for image size")
      }
    }
  })
  
});
var display_mode_on = false;
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
    $("#options_menu_gear > i").removeClass("fa-cog")
    $("#options_menu_gear > i").addClass("fa-times")
    $("#options_menu_gear").css("right", "31px")
    options_menu_open = true;
  } else {
    window.setTimeout(function () {
      $("#options_menu").css("display", "none");
    }, 200);
    $("#options_menu").css("opacity", "0");
    options_menu_open = false;
    $("#options_menu_gear > i").addClass("fa-cog")
    $("#options_menu_gear > i").removeClass("fa-times")
    $("#options_menu_gear").css("right", "30px")
    //"fa fa-cog"
    //fa fa-times
  }
}

//a=additional
function open_a_options() {
  $("#options_menu_additional").css("display", "block");
}

function close_a_options() {
  $("#options_menu_additional").css("display", "none");
}

function removeClassFromBrushes(name) {
  $("#pointBrush").removeClass(name);
  $("#lineBrush").removeClass(name);
  $("#eraser").removeClass(name);
  $("#triangleMove").removeClass(name);
}