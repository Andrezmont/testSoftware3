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
      url: "/account/area/listar",
      type: 'GET',
      error: function(respuesta) {
          console.log(respuesta);
      },
      success: function(respuesta) {
        // si no hay un area registrada se deshabilita el textarea
        if (respuesta.length === 0) {
          $("#select-1491894036054").attr("disabled","disabled");
        }else{
          $("#select-1491894036054").append("<option value='-1'>Seleccionar..</option>");
          for (var i = 0; i < respuesta.length; i++) {
            $("#select-1491894036054").append("<option value='"+respuesta[i].data[0].valor+"'>"+respuesta[i].data[0].valor+"</option>");
          }
        }
      }
    });
  },1000);

});
