$( document ).ready(function() {
  /**
  * @autor:godie007
  * @date: 2017/02/10 19:52
  * Algoritmo para dejar abierta la ruta donde se encuenta ubicado el modulo
  *  en que navega el usuario
  **/
  $("a").each(function() {
    if ($(this).attr("href") === window.location.pathname) {

      $(this).css({
          'outline': 'none',
          'background-color': '#393a39',
          'color': 'white'
      });
      var objetivo = $(this).parent();
      var contador = 1;
      while (objetivo !== undefined && objetivo.find("ul").length < 10) {
          var ruta  = objetivo.find("ul").eq(0).attr("id");
          if (ruta !== "") {
            $("#"+ruta).collapse('show');
            contador++;
          }
          objetivo = objetivo.parent();
        }

    }
  });
});
