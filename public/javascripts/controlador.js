$( document ).ready(function() {
  solicitarVista("/grafica/");
  $("#analizar").click(function() {
    solicitarVista("/grafica/");
  });
  $("#cuestionario").click(function() {
    solicitarVista("/cuestionario/");
  });
  $("#nivel").click(function() {
    solicitarVista("/nivel/");
  });
  $("#indicador").click(function() {
    solicitarVista("/indicador/");
  });
  $("#empresa").click(function() {
    solicitarVista("/empresa/");
  });
  $("#area").click(function() {
    solicitarVista("/area/");
  });
});
function solicitarVista(direccion) {
  $.ajax({
    url: direccion,
    type: 'POST',
    error: function(respuesta) {console.log(respuesta);},
    success: function(respuesta) {
      $("#bloque").html(respuesta);
    }
  });
}
