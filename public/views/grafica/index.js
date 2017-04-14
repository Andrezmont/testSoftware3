var data; // variable que almacena los indicadores relacionados a un area
$(document).ready(function() {
  /**
  * @autor:godie007
  * @date: 2017/04/13 14:56
  * En caso de que cambie la lista de seleccion de areas, se vuelve a cargar los indicadores relacionados a esa area
  **/
  $("#area").change(function() {
    /**
     * @autor:godie007
     * @date: 2017/04/13 14:48
     * Se cargan los indicadores relacionados a una determinada Area
     **/
     if ($(this).val() !== "-1") {
       $.ajax({
           url: "/account/grafica/",
           type: 'POST',
           data:{'area':$(this).val()},
           error: function(respuesta) {
               console.log(respuesta);
           },
           success: function(respuesta) {
               data = respuesta;
               $("#tabla tbody tr").remove();
               for (var i = 0; i < respuesta.length; i++) {
                   var campoTexto = '<input id="ent' + i + '" class="input-medium"  min="' + respuesta[i].min + '" max="' + respuesta[i].max + '" step="1" onblur="this.value = minmax(this.value, ' + respuesta[i].min + ', ' + respuesta[i].max + ')" type="number"value="' + respuesta[i].min + '">';
                   $("#tabla tbody").append('<tr><td>' + respuesta[i].titulo + '</td><td>' + respuesta[i].descripcion + '</td><td>' + respuesta[i].min + '</td><td>' + respuesta[i].max + '</td><td>' + campoTexto + '</td>' + '</tr>');
               }
               $("input:visible").eq(0).trigger('focus');
           }
       });
     }
  });
});
/**
 * @autor:godie007
 * @date: 2017/04/13 14:06
 * Al momento de hacer click en el boton graficar se toma la informacion de los indicadores
 * y la informacion suministrada por el usuario para calcular cada arista de la grafica
 **/
$("#graficar").click(function() {
    var salida1 = [];
    var salida2 = [];
    for (var s = 0; s < data.length; s++) {
        salida1.push(data[s].titulo);

        var caluculo1 = Math.abs(parseInt(100 * (parseInt($("#ent" + s).val()) - data[s].min) / (data[s].max - data[s].min))); // se hace el calculo del procentaje para cada areista de la grafica radial
        console.log(data[s].titulo + ":" + caluculo1 + "%");
        salida2.push(caluculo1);
    }
    var arreglo = salida2;
    var areaTotal = 0;
    var angulo = 360/arreglo.length;
    for (var h = 0; h < arreglo.length; h++) {
      var a = arreglo[h];
      var b = arreglo[h+1];
      if (h < arreglo.length -1) {
        a = arreglo[h];
        b = arreglo[h+1];
      }else{
        a = arreglo[h];
        b = arreglo[0];
      }
      console.log("a"+a+",b"+b);
      var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)- 2*a*b*Math.cos(toRadians(angulo)));

      var s1 = (a+b+c)/2;
      var area = Math.sqrt(s1*(s1-a)*(s1-b)*(s1-c));
      console.log("a: " + a+" ,b: " + b+" ,lado C: " + c +" ,Angulo: " + angulo+" ,Area: "+area);
      areaTotal += area;
    }
    console.log("Area Total = "+areaTotal);
    $("#areaF").text("Area Actual: "+areaTotal);

    function toRadians (angle) {
      return angle * (Math.PI / 180);
    }

    graficar(salida1, salida2);
});
/**
 * @autor:godie007
 * @date: 2017/04/13 14:16
 * Funcion para hacer el grafico de Radar en base a informacion dinamica que llega por parte de las configuracionesque haga el cliente
 **/
function graficar(entrada, entrada2) {
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.defaultFontColor = 'rgba(34,34,34, 1)'; //color del texto

    var chartRadarDOM = $('#chartRadar');
    // configuracion de la grafica
    var chartRadarData = {
        labels: entrada,
        datasets: [{
            label: "Grafica",
            backgroundColor: "rgba(156,63,74,.5)",
            borderColor: "rgba(9,138,1,.5)",
            pointBackgroundColor: "rgba(156,63,74,1)",
            pointBorderColor: "rgba(9,138,1,.5)",
            pointHoverBackgroundColor: "rgba(9,138,1,.5)",
            pointHoverBorderColor: "rgba(9,138,1,.5)",
            pointBorderWidth: 0.5,
            data: entrada2
        }]
    };
    var chartRadarOptions = {
        scale: {
            ticks: {
                beginAtZero: true,
                maxTicksLimit: 10
            },
            pointLabels: {
                fontSize: 12
            },
            gridLines: {
                color: '#999'
            }
        }

    };
    var chartRadar = new Chart(chartRadarDOM, {
        type: 'radar',
        data: chartRadarData,
        options: chartRadarOptions
    });
}
/**
 * @autor:godie007
 * @date: 2017/04/13 14:02
 * Funcion para limitar el los campos de texto a solo el rango que este configurado en la seccion de indicadores
 **/
function minmax(value, min, max) {
    if (parseInt(value) < min || isNaN(parseInt(value))) {
        return min;
    } else {

        if (parseInt(value) > max) {
            toastr.options = {
                closeButton: true,
                debug: false,
                newestOnTop: false,
                progressBar: true,
                positionClass: "toast-top-center" || 'toast-top-right',
                preventDuplicates: false,
                timeOut: "1000",
                onclick: function() {
                    console.log("Toco el Mensaje");
                }
            };
            /**
             * @autor:godie007
             * @date: 2017/04/13 14:31
             * Plugin para mostrar Notificación emergente de Advertenca
             **/
            toastr.warning("El valor deve estar en el intervalo [" + min + "," + max + "]", "Importante!");
            return max;
        } else {
            return value;
        }
    }

}
