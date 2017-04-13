$( document ).ready(function() {
  setTimeout(function() {
    //se limpian los select list

    var combox = $('select[id^="select-"]:not([id*="preview"])');
    for (var i = 0; i < combox.length; i++) {
      var titulo = combox.eq(i).parent().find("label").text().trim();
      if (titulo === "Area") {
        combox.eq(i).find('option').remove();
      }

    }

    $.ajax({
      url: "/admin/area/listar",
      type: 'GET',
      error: function(respuesta) {
          console.log(respuesta);
      },
      success: function(respuesta) {
        // si no hay un area registrada se deshabilita el textarea
        if (respuesta.length === 0) {
          $("#select-1492050948070").attr("disabled","disabled");
        }else{
          for (var i = 0; i < respuesta.length; i++) {
            if (respuesta[i].data) {
              $("#select-1492050948070").append("<option value='"+respuesta[i].data[0].valor+"'>"+respuesta[i].data[0].valor+"</option>");
            }
          }
        }
      }
    });
  },1000);

});
