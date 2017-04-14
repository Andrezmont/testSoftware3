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
          for (var i = 0; i < $("select").length; i++) {
            var area = $("select").eq(i).parent().find("label").text().trim();
            if (area === "Area") {
              $("select").eq(i).attr("disabled","disabled");
            }
          }
        }else{
          for (var s = 0; s < respuesta.length; s++) {
            if (respuesta[s].data) {
              for (var i2 = 0; i2 < $("select").length; i2++) {
                var area2 = $("select").eq(i2).parent().find("label").text().trim();
                if (area2 === "Area") {
                  $("select").eq(i2).append("<option value='"+respuesta[s]._id+"'>"+respuesta[s].data[0].valor+"</option>");
                }
              }
            }
          }
        }
      }
    });
  }, 1000);
});
