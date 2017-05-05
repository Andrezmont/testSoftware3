var data; // variable que almacena los indicadores relacionados a un area
var engine = window.engine;

$(document).ready(function() {
    $("#tabla").hide();
    $("#chartRadar").hide();
    $("#resultado").hide();
    $("#resultado").hide();
    $("button[name='next']").attr('style', 'background-color: #bf0000;');

    $("button[name='next']").prop('disabled', true);
    $("#area").trigger('focus');
    var step = 0;
    var stepItem = $('.step-progress .step-slider .step-slider-item');

    $('.step-content .step-content-foot button[name="prev"]').addClass('out');

    // Step Next
    $('.step-content .step-content-foot button[name="next"]').on('click', function() {
        var instance = $(this);
        if (stepItem.length - 1 < step) {
            return;
        }
        $('.step-content .step-content-foot button[name="prev"]').removeClass('out');
        if (step == (stepItem.length - 2)) {
            instance.addClass('out');
            instance.siblings('button[name="finish"]').removeClass('out');
        }
        $(stepItem[step]).addClass('active');
        $('.step-content-body').addClass('out');
        step++;
        if (step == 1) {
            $("#formInicio").hide();
            $("#formCuestionario").show();
            $("#chartRadar").hide();
            $("#resultado").hide();
            console.log("PASO 2");
        }
        console.log(JSON.stringify(stepItem[step]));
        if (stepItem[step]) {
          $('#' + stepItem[step].dataset.id).removeClass('out');
        }
    });

    // Step Last
    $('.step-content .step-content-foot button[name="finish"]').on('click', function() {
        if (step == stepItem.length) {
            return;
        }

        $("#formInicio").hide();
        $("#formCuestionario").hide();
        $("#chartRadar").show();
        $("#resultado").show();
        $('button[name="prev"]').hide();
        $("button[name='finish']").hide();
        generarGrafica();

        $(stepItem[stepItem.length - 1]).addClass('active');
        $('.step-content-body').addClass('out');
        $('#stepLast').removeClass('out');
        step++;
    });

    // Step Previous
    $('.step-content .step-content-foot button[name="prev"]').on('click', function() {
        if (step - 1 < 0) {
            return;
        }
        if (step == 1) {
            console.log("PASO 1");
            $("#formInicio").show();
            $("#formCuestionario").hide();
            $("#chartRadar").hide();
            $("#resultado").hide();
        }
        if (step == 2) {
            $("#formCuestionario").show();
            $("#chartRadar").hide();
            $("#resultado").hide();
        }
        step--;
        var instance = $(this);
        if (step <= (stepItem.length - 1)) {
            instance.siblings('button[name="next"]').removeClass('out');
            instance.siblings('button[name="finish"]').addClass('out');
        }
        $('.step-content-body').addClass('out');
        $('#' + stepItem[step].dataset.id).removeClass('out');
        if (step === 0) {
            stepItem.removeClass('active');
        } else {
            stepItem.filter(':gt(' + (step - 1) + ')').removeClass('active');
        }
        if (step - 1 < 0) {
            $('.step-content .step-content-foot button[name="prev"]').addClass('out');
        }
    });
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
        $("#tabla").show();
        if ($(this).val() === "-1") {
            $("button[name='next']").attr('style', 'background-color: #bf0000;');
            $("button[name='next']").prop('disabled', true);
            $("table.table").hide();
            $("#formCuestionario").hide();
        } else {
            $("button[name='next']").attr('style', 'background-color: #00ACC2;');
            $("button[name='next']").prop('disabled', false);
        }
        if ($(this).val() !== "-1") {
            $.ajax({
                url: "/account/grafica/",
                type: 'POST',
                data: {
                    'area': $(this).val()
                },
                error: function(respuesta) {
                    console.log(respuesta);
                },
                success: function(respuesta) {
                    data = respuesta;
                    if (respuesta.length === 0) {
                        $("#tabla").hide();
                        $("button[name='next']").attr('style', 'background-color: #bf0000;');
                        $("button[name='next']").prop('disabled', true);
                    }
                    $("#tabla tbody tr").remove();
                    for (var i = 0; i < respuesta.length; i++) {
                        var campoTexto = '<input id="ent' + i + '" class="input-medium"  min="' + respuesta[i].min + '" max="' + respuesta[i].max + '" step="1" onblur="this.value = minmax(this.value, ' + respuesta[i].min + ', ' + respuesta[i].max + ')" type="number"value="' + respuesta[i].min + '">';
                        $("#tabla tbody").append('<tr><td>' + respuesta[i].titulo + '</td><td>' + respuesta[i].descripcion + '</td><td>' + respuesta[i].min + '</td><td>' + respuesta[i].max + '</td><td>' + campoTexto + '</td>' + '<td>' + respuesta[i].formula + '</td></tr>');
                    }
                    $("input:visible").eq(0).trigger('focus');
                }
            });
            /**
             * @autor:godie007
             * @date: 2017/04/15 00:10
             * Se consulta el cuestionario relacionado a un area y se genera dinamicamente
             * el formulario de preguntas
             **/
            $.ajax({
                url: "/account/grafica/cuestionario/",
                type: 'POST',
                data: {
                    'area': $(this).val()
                },
                error: function(respuesta) {
                    console.log(respuesta);
                },
                success: function(r) {
                    $("#formCuestionario div").remove();
                    for (var i = 0; i < r.ask.length; i++) {
                        var form = '<form>';
                        var Sform = '</form>';
                        var div = '<div class="box">';
                        var Sdiv = '</div>';
                        var label = '<label class="control-label">' + r.ask[i].text + '</label>';
                        var radio = '<div class="radio">';
                        var Slabel = '<label>';
                        var labelA = r.ask[i].OA.length > 1 ? '<input type="radio" class="radio' + i + '" id="radio" class="' + i + '" value="A" name="radio"/>' + r.ask[i].OA + '</br>' : '';
                        var labelB = r.ask[i].OB.length > 1 ? '<input type="radio" class="radio' + i + '" id="radio" class="' + i + '" value="B" name="radio"/>' + r.ask[i].OB + '</br>' : '';
                        var labelC = r.ask[i].OC.length > 1 ? '<input type="radio" class="radio' + i + '" id="radio" class="' + i + '" value="C" name="radio"/>' + r.ask[i].OC + '</br>' : '';
                        var labelD = r.ask[i].OD.length > 1 ? '<input type="radio" class="radio' + i + '" id="radio" class="' + i + '" value="D" name="radio"/>' + r.ask[i].OD + '</br>' : '';

                        $("#formCuestionario").append(div + label + form + radio + labelA + labelB + labelC + labelD + Sdiv + Sform + Slabel + Sdiv + Sdiv);
                        $("#formCuestionario").hide();

                    }
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
function generarGrafica() {
    /**
     * @autor:godie007
     * @date: 2017/04/15 02:45
     * Se realizan los calculos para determinar el area total de la grafica de radar
     **/
    var result = engine.calculateEdges(data);
    var labels = result.labels;
    var values = result.values;

    $.ajax({
        url: "/account/grafica/cuestionario/",
        type: 'POST',
        data: {
            'area': $("#area").val()
        },
        error: function(respuesta) {
            console.log(respuesta);
        },
        success: function(doc) {
            var contador = 0;
            var minimo = 0;
            var maximo = 0;
            var op = 0;
            for (var i = 0; i < doc.ask.length; i++) {
                for (var d = 0; d < $("input[id^='radio']:checked").length; d++) {
                    var id = parseInt($("input[id^='radio']:checked").eq(d).attr("class").split("radio")[1]);
                    if (id == i) {
                        var opcion = $("input[id^='radio']:checked").eq(d).val();
                        op += doc.ask[i]['R'+opcion];
                        // se determina el valor minimo de peso
                        var min = doc.ask[i].RA;
                        min = doc.ask[i].RA <= min && doc.ask[i].RA!==0 ? doc.ask[i].RA:min;
                        min = doc.ask[i].RB <= min && doc.ask[i].RB!==0 ? doc.ask[i].RB:min;
                        min = doc.ask[i].RC <= min && doc.ask[i].RC!==0 ? doc.ask[i].RC:min;
                        min = doc.ask[i].RD <= min && doc.ask[i].RD!==0 ? doc.ask[i].RD:min;
                        minimo += min;
                        // se determina el valor maximo de peso
                        var max = doc.ask[i].RA;
                        max = doc.ask[i].RA >= max && doc.ask[i].RA!==0 ? doc.ask[i].RA:max;
                        max = doc.ask[i].RB >= max && doc.ask[i].RB!==0 ? doc.ask[i].RB:max;
                        max = doc.ask[i].RC >= max && doc.ask[i].RC!==0 ? doc.ask[i].RC:max;
                        max = doc.ask[i].RD >= max && doc.ask[i].RD!==0 ? doc.ask[i].RD:max;
                        maximo += max;

                    }
                }
            }

            var porcent = Math.abs(100*((op-minimo)/(maximo-minimo)));
            console.log("respueta "+op+" min "+minimo+" max " + maximo);
            console.log("Porcentaje "+porcent);
            labels.push("Questionnaire");
            values.push(porcent);

            var areaActual = engine.calculateArea(values).toFixed(2);
            $("#areaF").text("Area Actual: " + areaActual);

            $.ajax({
                url: "/account/grafica/nivel/",
                type: 'POST',
                error: function(respuesta) {
                    console.log(respuesta);
                },
                success: function(doc) {
                    var p_total = engine.calculatePercentage(areaActual,values.length).toFixed(2);
                    var nivel = engine.calculateLevel(doc, p_total);

                    $("#procentF").text("Procentaje Actual: " + p_total + "%");
                    $("#nivelA").text("La empresa esta en " + nivel);
                    var areaTotal = engine.calculateAreaTotal(values.length).toFixed(2);
                    window.saveCaculus(areaTotal,areaActual,nivel,p_total);
                }
            });

            graficar(labels, values);
        }
    });

}
window.saveCaculus = function(a_total,a_actual,nivel,porcentaje) {
  console.log("Registro Guardado!");
  $.ajax({
      url: "/account/grafica/registro/",
      type: 'POST',
      data:{
        'a_total':a_total,
        'a_actual':a_actual,
        'nivel':nivel,
        'porcentaje':porcentaje,
        'usuario':$("#usuario").attr("class"),
        'empresa':$("#empresa").attr("class")
      },
      error: function(respuesta) {
          console.log(respuesta);
      },
      success: function(doc) {
          console.log(doc);
      }
  });
};
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
window.minmax =function(value, min, max) {
    if (parseInt(value) < min || isNaN(parseInt(value))) {
        return min;
    } else {

        if (parseInt(value) > max) {
            window.toastr.options = {
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
            toastr.warning("El valor debe estar en el intervalo [" + min + "," + max + "]", "Importante!");
            return max;
        } else {
            return value;
        }
    }

};
