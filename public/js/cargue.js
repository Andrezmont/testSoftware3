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
    var contador = 0;
    while (objetivo !== undefined && contador !== 50) {
        var ruta  =objetivo.find("ul").eq(0).attr("id");
        if (ruta !== "") {
          $("#"+ruta).collapse('show');
          contador++;
        }
        objetivo = objetivo.parent();
      }

  }
});
/**
* @autor:godie007
* @date: 2017/02/10 19:30
* funcion para limitar a solo numeros un determinado campo de texto
**/
$("#entrada").keydown(function (e) {

    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
         // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
         // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
         // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
         // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             // let it happen, don't do anything
             return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});
