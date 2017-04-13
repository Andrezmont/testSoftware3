var data;
$( document ).ready(function() {
  $.ajax({
    url: "/account/grafica/",
    type: 'POST',
    error: function(respuesta) {
        console.log(respuesta);
    },
    success: function(respuesta) {
        data = respuesta;
        for (var i = 0; i < respuesta.length; i++) {
          var campoTexto = '<input id="ent'+i+'" class="input-medium"  min="'+respuesta[i].min+'" max="'+respuesta[i].max+'" step="1" onblur="this.value = minmax(this.value, '+respuesta[i].min+', '+respuesta[i].max+')" type="number"value="'+respuesta[i].min+'">';
          $("#tabla tbody").append('<tr><td>'+respuesta[i].titulo+'</td><td>'+respuesta[i].descripcion+'</td><td>'+respuesta[i].min+'</td><td>'+respuesta[i].max+'</td><td>'+campoTexto+'</td>'+'</tr>');
        }
        $("input:visible").eq(0).trigger('focus');
    }
  });
});
$("#graficar").click(function() {
  var salida1 = [];
  var salida2 = [];
  for (var s = 0; s < data.length; s++) {
    salida1.push(data[s].titulo);

    var caluculo1 = Math.abs(parseInt(100*(parseInt($("#ent"+s).val())-data[s].min)/(data[s].max-data[s].min)));// se hace el calculo del procentaje para cada areista de la grafica radial
    console.log(data[s].titulo+":"+caluculo1+"%");
    salida2.push(caluculo1);
  }
  graficar(salida1,salida2);
});
function graficar(entrada,entrada2) {
  Chart.defaults.global.legend.display = false;
  Chart.defaults.global.defaultFontColor = 'rgba(34,34,34, 1)';//color del texto

  var chartRadarDOM = $('#chartRadar');
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
function minmax(value, min, max) {
    if(parseInt(value) < min || isNaN(parseInt(value))){
      return min;
    }else {

      if(parseInt(value) > max){
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
        //success error warning info
        toastr.warning("El valor deve estar en el intervalo ["+min+","+max+"]", "Importante!");
        return max;
      }else {
        return value;
      }
    }

}
