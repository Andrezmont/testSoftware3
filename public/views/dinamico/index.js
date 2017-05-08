/**
 * @autor:godie007
 * @date: 2017/01/11 03:09
 * Esta función tiene como propocito tomar de una imagen el codigo en base64 para
 * ser usado mas adelante para subir en el servidor
 **/
function generarImagen(file, index) {

    var filesSelected = file.files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        if (!fileToLoad.name.match(/\.(jpg|jpeg|png|gif|tiff|bmp|ico)$/)) {
            alert('El archivo que intenta subir no es una Imgen');
        } else {
            if (fileToLoad.size / 1024 <= 1024) {

                var fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent) {
                    var newImage = document.createElement('img');
                    var srcData = fileLoadedEvent.target.result; // <--- data: base64
                    newImage.src = srcData;
                    newImage.style.height = '80px';
                    newImage.style.width = '80px';
                    document.getElementById("imagen" + index).innerHTML = newImage.outerHTML;
                };
                fileReader.readAsDataURL(fileToLoad);
            } else {
                alert("Disculpe, No se permiten Imagenes mayores a 1024 kb!");
            }
        }
    }
}
/**
 * @autor:godie007
 * @date: 2017/01/11 03:04
 * En caso de Ingresar un nuevo registro se limpian todos los campos
 **/
function limpiarCampos() {
    var camps = $('input[type=datetime-local]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id*="checkbox"]:not([id*="preview"]):not([id*="group"])');
    camps.each(function() {
        $(this).val("");
    });
}
/**
 * @autor:godie007
 * @date: 2017/01/11 03:28
 * De la fecha del sistema Actual se toma el formato PM AM
 **/
function formatAMPM(d) {
    var today = d;
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = (h % 12 === 0) ? 12 : h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return (h + ':' + m + ':' + s + ' ' + ampm);
}
/**
 * @autor:godie007
 * @date: 2017/01/11 03:21
 * En caso de presionar en el boton ver se visualiza el registro en los items construidos
 * dinamicamente
 **/
window.ver = function(id){
  $("#id").val(id);

  $.ajax({
      url: "/admin/" + $("#modulo").attr("class") + "/ver/",
      type: 'POST',
      data: {
          'id': id
      },
      error: function(respuesta) {
          console.log(respuesta);
      },
      success: function(respuesta) {
          console.log("Se limpian Campos");
          limpiarCampos();

          for (var i = 0; i < respuesta.length; i++) {
              var valor = respuesta[i].valor;
              var id = respuesta[i].id;
              var tipo = respuesta[i].id.split("-")[0];
              var tipo2 = respuesta[i].id.split("-")[0] + "-" + respuesta[i].id.split("-")[1];
              if (tipo === 'textarea') {
                  $("#" + id).val(valor);
              }
              if (tipo === 'file') {
                  var id2 = respuesta[i].id.split("-")[1];
                  $("#imagen" + id2).html(valor);
              }
              if (tipo === 'text') {
                  $("#" + id).val(valor);
              }
              if (tipo === 'radio') {
                  $("#" + id).prop("checked", true);
              }
              if (tipo === 'select') {
                  $("#" + id).val(valor);
              }
              if (tipo === 'date') {
                  $("#" + id).val(valor);
              }
              if (tipo === 'number') {
                  $("#" + id).val(valor);
              }
              if (tipo === 'checkbox') {
                  var actual = $("#" + id).prop('checked');
                  valor = valor === 'true' ? true : false;
                  if (valor !== actual) {
                      $("#" + id).prop("checked", valor);
                  }
              }
              if (tipo2 === 'checkbox-group') {
                  var ids = respuesta[i].id.split("/*");
                  for (var s = 0; s < ids.length; s++) {
                      $("#" + ids[s]).prop("checked", true);
                  }
              }
          }
          setTimeout(function() {
              $("input:visible").eq(0).trigger('focus');
          }, 200);
          $("#actualizar").show();
          $("#guardar").hide();
      }
  });
};
/**
 * @autor:godie007
 * @date: 2017/01/11 03:21
 * Este metodo elimina un determinado registro teniendo como parametro su id
 **/
window.eliminar =function (id) {
    if (confirm('¿Está Seguro?')) {
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
        toastr.warning("El registro se ha Eliminado!.", "Importante!");
        $.ajax({
            url: "/admin/" + $("#modulo").attr("class") + "/",
            type: 'DELETE',
            data: {
                'id': id
            },
            error: function(respuesta) {
                console.log(respuesta);
            },
            success: function(respuesta) {
                if (respuesta !== '') {
                    mostrarTabla();
                    console.log(respuesta);
                }
            }
        });
    }
};
/**
 * @autor:godie007
 * @date: 2017/01/11 03:24
 * Este metodo se utiliza para Contruir el formulario dinamico e inyectar la funcionalidad
 * de imagenes en vista previa
 **/
function generarCampos() {
    setTimeout(function() {
        $("input[id^='file-']:not([id$='preview'])").each(function() {
            var id = $(this).attr("id").split("-")[1];
            var direccion = "/images/default.png";
            $(".field-file-" + id).append('<div id="imagen' + id + '"><img src="' + direccion + '" style="height:80px;width:80px;"></div>');
            $("#file-" + id).change(function() {
                generarImagen(this, id);
            });
        });
        if ($("input[type=checkbox]:checked").length === 0) {
            $(".eliminar").attr("disabled", "disabled");
        } else {
            $(".eliminar").css({
                'color': 'red'
            });
        }
    }, 1000);

    $.ajax({
        url: "/admin/formulario/" + $("#modulo").attr("class") + "/",
        type: 'POST',
        data: {
            'modulo': $("#modulo").attr("class")
        },
        error: function(respuesta) {
            console.log(respuesta);
        },
        success: function(respuesta) {
            $("#panel").css('visibility', 'hidden');
            if (respuesta.length > 0) {
                window.sessionStorage.setItem('formData', JSON.stringify(JSON.stringify(respuesta)));
            }

            var almacenados = JSON.stringify(JSON.stringify(respuesta));
            var buildWrap = document.querySelector('.build-wrap'),
                renderWrap = document.querySelector('.render-wrap'),
                formData = almacenados,
                editing = true,
                fbOptions = {
                    dataType: 'json'
                };

            if (formData) {
                fbOptions.formData = JSON.parse(formData);
            }

            var toggleEdit = function() {
                document.body.classList.toggle('form-rendered', editing);
                editing = !editing;
            };

            var formBuilder = $(buildWrap).formBuilder(fbOptions).data('formBuilder');
            toggleEdit();
            $(renderWrap).formRender({
                dataType: 'json',
                formData: formBuilder.formData
            });

            $("label").each(function(){
              var str = $(this).text();
              if (str.indexOf("_") !== -1) {
                  var i = 0, strLength = str.length;
                  for(i; i < strLength; i++) {
                   str = str.replace("_", " ");
                  }
                  $(this).text(str);
                }
              });
            mostrarTabla();
        }
    });

}
/**
 * @autor:godie007
 * @date: 2017/01/11 03:17
 * Este metodo analiza la informacion de formulario contruido dinamicamente
 * y saca sus etiquetas para dar los titulos a la tabla del plugin datatable
 **/
function generarTitulosDinamicos() {

    var json = '[';
    var inputs = $('input[type=datetime-local]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id*="checkbox"]:not([id*="preview"]):not([id*="group"])');
    var inputs2 = $('div[class*="field-checkbox-group"]:not([class*="preview"])');

    for (var i = 0; i < inputs2.length; i++) {
        json += '{';
        var label = inputs2.eq(i).contents().eq(0).text().trim();

        json += '"label":"' + label.replace("?", "") + '",';
        json += '"valor":""';
        json += '},';
    }
    for (var w = 0; w < inputs.length; w++) {
        var label2;
        json += '{';
        label2 = inputs.eq(w).parent().find("label").text().trim();
        if (inputs.eq(w).parent().find("label").length > 1) {
            label2 = inputs.eq(w).parent().parent().find("label").eq(0).text().trim();
        }
        if (inputs.eq(w).parent().find("label").length === 0) {
            label2 = inputs.eq(w).parent().parent().find("label").text();
        }
        json += '"label":"' + label2.replace("?", "") + '",';
        json += '"valor":""';
        json += '},';
    }
    json += '{"label":"Usuario de Creación",';
    json += '"valor":""},';
    json += '{"label":"Fecha de Creación",';
    json += '"valor":""},';
    json += '{"label":"Usuario de Actualización",';
    json += '"valor":""},';
    json += '{"label":"Fecha de Actualización",';
    json += '"valor":""}';
    json += ']';

    var arreglo = JSON.parse(json);

    var salida = [{
        "data": "_id",
        title: "<input type='checkbox' id='example-select-all'>"
    }, {
        "data": "indice",
        title: "N°"
    }];

    var cadena = '[';

    for (var k = 0; k < arreglo.length; k++) {
        cadena += '{"data": "' + arreglo[k].label + '","title": "' + arreglo[k].label + '"}';
        if (k !== arreglo.length - 1) {
            cadena += ',';
        }
    }
    cadena += ']';
    var elementos = JSON.parse(cadena);

    for (var j = 0; j < elementos.length; j++) {
        salida.push(elementos[j]);
    }

    salida.push({
        "data": "_id",
        title: "Acción",
        'searchable': false,
        'orderable': false,
        render: function(data, type, row) {
            return '<div class="btn-group"><button type="button" data-toggle="modal" onclick="ver(&quot;'+data+'&quot;);" data-target="#myModal" class="btn btn-default" >Editar</button><button type="button" onclick="eliminar(&quot;'+data+'&quot;);"class="btn btn-default" >Eliminar</button></div>';
        }
    });
    return salida;
}
/**
 * @autor:godie007
 * @date: 2017/01/11 03:20
 * El proposito de este metodo es tomar los valores de los items construidos dinamicamente
 * y retornarlos en una estructura JSON para luego ser almacenados en base de datos
 **/
function tomarValores() {
    var json = '[';

    var inputs2 = $('div[class*="field-checkbox-group"]:not([class*="preview"])');

    for (var i = 0; i < inputs2.length; i++) {
        var items = $(inputs2[i]).find("label");
        var entra = $(inputs2[i]).find("input");
        json += '{';
        var acomulado = '';
        var ids = '';
        for (var s = 1; s < items.length; s++) {
            var data = $(items[s]).text().trim();
            if ($(entra[s - 1]).is(":checked")) {
                acomulado += data + '<br>';
                ids += $(entra[s - 1]).attr("id");
            }
            if (data !== '') {
                if (s < items.length - 1) {
                    ids += '/*';
                }
            }
        }

        var label = inputs2.eq(i).contents().eq(0).text().trim();
        json += '"titulo":"' + label.replace("?", "") + '",';
        json += '"valor":"' + acomulado + '",';
        json += '"id":"' + ids + '"';
        json += '},';
    }
    var inputs = $('input[type=datetime-local]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id*="checkbox"]:not([id*="preview"]):not([id*="group"])');

    for (var d = inputs.length - 1; d >= 0; d--) {
        if (inputs.eq(d).length > 0) {

            var titulo = inputs.eq(d).parent().find("label").eq(0).text().trim();
            var valor = inputs.eq(d).val() === '' ? ' ' : inputs.eq(d).val();

            if (inputs.eq(d).attr("id").indexOf("radio-group") !== -1) {
                titulo = inputs.eq(d).parent().parent().find("label").eq(0).text().trim();
                var num = inputs.eq(d).attr("id").split("-")[3];
                valor = inputs.eq(d).parent().find("label").eq(num).text().trim();
            }

            if (inputs.eq(d).attr("id").indexOf("select-") !== -1) {
                valor = inputs.eq(d).find("option:selected").val();
            }
            if (inputs.eq(d).attr("id").indexOf("file-") !== -1) {
                var id = inputs.eq(d).attr("id").split("-")[1];
                var img = $("#imagen" + id + " img").prop("src");
                if (img === undefined || img === '') {
                    img = '/images/default.png';
                }
                valor = '<img src=' + img + ' style=height:80px;width:80px;>';
            }
            if (inputs.eq(d).attr("id").indexOf("checkbox-") !== -1) {
                if (inputs.eq(d).parent().find("label").length === 0) {
                    titulo = inputs.eq(d).parent().parent().find("label").text().trim();
                } else {
                    titulo = inputs.eq(d).parent().find("label").text().trim();
                }

                valor = $("#" + inputs.eq(d).attr("id")).is(':checked');
            }
            json += '{"id":"' + inputs.eq(d).attr("id") + '",';
            json += '"titulo":"' + titulo.replace("?", "") + '",';
            json += '"valor":"' + valor + '"}';
        }
        if (d > 0 && $("#id").val() === "") {
            json += ",";
        }
        if ($("#id").val() !== "") {
            json += ",";
        }
    }
    if ($("#id").val() !== "") {

        var date = new Date();
        var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);

        json += '{"id":"usuAct",';
        json += '"titulo":"Usuario de Actualización",';
        json += '"valor":"' + $("#usuario").attr("class") + '"},';
        json += '{"id":"fechaC",';
        json += '"titulo":"Fecha de Actualización",';
        json += '"valor":"' + fecha + '"}';
    }
    json += ']';
    var sa = JSON.parse(json);
    return sa;
}

$(document).ready(function() {

    generarCampos();



    $("#menuContactos").click();
    $("#menuCientes").click();
    $("#in_3").css({
        'outline': 'none',
        'background-color': '#393a39',
        'color': 'white'
    });

    $("#actualizar").hide();
    $(".alert").hide();
    $("#guardar").show();

    $("#ingresar").click(function() {
        $("#guardar").show();
        $("#actualizar").hide();
        $("input,textarea").val("");
        $(".alert").hide();
    });

    $("#guardar").click(function() {
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
        toastr.success("Se ha Guardado el Producto.", "Felicidades!");
        $.ajax({
            url: "/admin/" + $("#modulo").attr("class") + "/",
            type: 'POST',
            data: {
                'data': tomarValores(),
                'usuario': $("#usuario").attr("class"),
                'modulo': $("#modulo").attr("class"),
                'empresa': $("#empresa").attr("class")
            },
            error: function(respuesta) {
                console.log(respuesta);
            },
            success: function(respuesta) {
                if (respuesta !== '') {
                    mostrarTabla();
                    $('#myModal').modal('hide');

                    $('#myModal').hide();
                    $('.modal-backdrop').hide();
                }
            }
        });
    });

    $("#actualizar").click(function() {
        $(".alert").hide();
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
        toastr.info("Actualizado Correctamente.", "Felicidades!");
        $.ajax({
            url: "/admin/" + $("#modulo").attr("class") + "/",
            type: 'PUT',
            data: {
                '_id': $("#id").val(),
                'data': tomarValores()
            },
            error: function(respuesta) {
                console.log(respuesta);
            },
            success: function(respuesta) {
                if (respuesta !== '') {
                    $(".alert").show();
                    mostrarTabla();
                }
            }
        });
    });
});
/**
* @autor:godie007
* @date: 2017/05/01 11:03
* Funcion para generar una tabla en base al plugin datatable al hacer una
* petición ajax al modulo dinamico que lo necesite
**/
function mostrarTabla() {
    $.ajax({
        url: "/admin/" + $("#modulo").attr("class") + "/listar/",
        type: 'GET',
        error: function(respuesta) {
            console.log(respuesta);
        },
        success: function(respuesta) {
            mostrar(respuesta);
            $(".ingresar").trigger('focus');
        }
    });
}

window.registro = [];
/**
* @autor:godie007
* @date: 2017/05/01 11:59
* este metodo se encarga de generar en base a un json y a los titulos dinamicos del
* formbuilder una tabla adapatable
**/
function mostrar(entrada) {
  registro = entrada;
    // se hace la adaptacion dinamica a la tabla
    var temp = [];
    var inputs = $('input[type=datetime-local]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id^="checkbox-"]:not([id*="preview"]),div[class*="radio-group"]:not([class*="preview"])');
    // se expande dinamicamente los campos que no existen ahun en base de datos

    for (var i = 0; i < entrada.length; i++) {
        temp.push({});
        temp[i].indice = i;
        temp[i]._id = entrada[i]._id;

        for (var s = 0; s < inputs.length; s++) {
            var label = inputs.eq(inputs.length - 1 - s).parent().find("label").eq(0).text().trim();
            if (inputs.eq(inputs.length - 1 - s).parent().find("label").length > 1) {
                label = inputs.eq(inputs.length - 1 - s).parent().parent().find("label").eq(0).text().trim();
            }
            if (inputs.eq(s).parent().find("label").length === 0) {
                label = inputs.eq(inputs.length - 1 - s).parent().parent().find("label").eq(0).text().trim();
            }
            label = label.replace("?", "");
            temp[i][label] = '';
            temp[i]["Fecha de Actualización"] = '';
            temp[i]["Fecha de Creación"] = '';
            temp[i]["Usuario de Creación"] = '';
            temp[i]["Usuario de Actualización"] = '';

        }
        for (var f = 0; f < inputs.length; f++) {
            if (entrada[i].data[f] !== undefined) {
                var valor = entrada[i].data[f].valor;
                if (entrada[i].data[f].titulo === 'Valor') {
                  valor = "$" +separar(entrada[i].data[f].valor + '', ',');
                }
                temp[i][entrada[i].data[f].titulo] = valor;
            }
        }
        var date = new Date(entrada[i].fecha_creacion);
        var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);
        temp[i]["Fecha de Creación"] = fecha;
        temp[i]["Usuario de Creación"] = entrada[i].usuario;

        if (entrada[i].data[inputs.length] !== undefined) {
            for (var d = 0; d < entrada[i].data.length; d++) {
                if (entrada[i].data[d].titulo === "Fecha de Actualización") {
                    temp[i]["Fecha de Actualización"] = entrada[i].data[d].valor;
                }
                if (entrada[i].data[d].titulo === "Usuario de Actualización") {
                    temp[i]["Usuario de Actualización"] = entrada[i].data[d].valor;
                }
            }

        }
    }
    $("input[id^=date-]").addClass("form-control").attr('type', 'datetime-local');
    table = $('#example').DataTable({
        "data": temp,
        "order": [
            [1, "asc"]
        ],
        "columns": generarTitulosDinamicos(),
        'columnDefs': [{
            'targets': 0,
            'searchable': false,
            'orderable': false,
            'className': 'dt-body-center',
            'render': function(data, type, full, meta) {
                return '<input type="checkbox" class="' + $('<div/>').text(data).html() + '">';
            }
        }],
        "destroy": true,
        select: true,
        responsive: true,
        altEditor: true,
        dom: 'Bfrtip',
        stateSave: true,
        lengthMenu: [
            [ 10, 25, 50,100,500, -1 ],
            [ '10 Filas', '25 Filas', '50 Filas', '100 Filas', '500 Filas', 'Mostrar Todo' ]
        ],
        buttons: [
              {
                text: 'Filas',
                extend: 'pageLength'
              },
              {
                text: 'Ingresar',
                className: 'ingresar',
                action: function(e, dt, node, conf) {
                    $('#id').val('');
                    $('#myModal').modal('show');
                    $("#actualizar").hide();
                    $("#guardar").show();
                    limpiarCampos();
                    $("div[id^=imagen]").each(function() {
                        $(this).find("img").prop("src", "/images/default.png");
                    });
                    setTimeout(function() {
                        $("input:visible").eq(0).trigger('focus');
                    }, 200);
                }
            },
            {
                text: 'Mostrar Columnas',
                postfixButtons: ['colvisRestore'],
                extend: 'colvis'
            },
            {
                text: 'Eliminar Selección',
                className: 'eliminar',
                action: function(e, dt, node, conf) {
                    if (confirm('¿Está Seguro?')) {
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
                        toastr.warning("Los inventarios se han Eliminado!.", "Importante!");
                        $("input[type='checkbox']").each(function() {
                            if ($(this).is(":checked")) {
                                $.ajax({
                                    url: "http://" + window.location.hostname + ":" + window.location.port + "/admin/" + $("#modulo").attr("class") + "/",
                                    type: 'DELETE',
                                    data: {
                                        'id': $(this).attr("class")
                                    },
                                    error: function(respuesta) {
                                        console.log("Error " + respuesta);
                                    },
                                    success: function(respuesta) {
                                      console.log(respuesta);
                                    }
                                });
                            }
                        });
                        setTimeout(function() {
                          mostrarTabla();
                        },500);
                    }
                }
            },
            {
                extend: 'collection',
                text: 'Exportar',
                buttons: [{
                    extend: 'pdfHtml5',
                    customize: function ( doc ) {
                        // Splice the image in after the header, but before the table
                        doc.content.splice( 1, 0, {
                            margin: [ 0, 0, 0, 12 ],
                            alignment: 'center',
                            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9lpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxN2FlYzk4Yy0zMjgzLTExZGEtYTIzOC1lM2UyZmFmNmU5NjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUYzODU5RTYxNDNCMTFFNTlBNjVCOTY4NjAwQzY5QkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUYzODU5RTUxNDNCMTFFNTlBNjVCOTY4NjAwQzY5QkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowODgwMTE3NDA3MjA2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'
                        } );
                        // Data URL generated by http://dataurl.net/#dataurlmaker
                    },
                    exportOptions: {
                        columns: ':not(:last-child)'
                    }

                }, {
                    text: 'CSV',
                    extend: 'csvHtml5',
                    exportOptions: {
                        columns: ':not(:last-child)'
                    }
                }, {
                    text: 'Copiar',
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: ':not(:last-child)'
                    }
                }, {
                    text: 'Exel',
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: ':not(:last-child)'
                    },
                    customize: function(xlsx) {
                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        $('row c[r^="C"]', sheet).attr('s', '2');
                    }
                }]
            }
        ]
    });

    $("input[type=checkbox]:visible").click(function() {
        $(".eliminar").removeAttr("disabled");
        if ($("input[type=checkbox]:checked").length === 0) {
            $(".eliminar").attr("disabled", "disabled");
        } else {
            $(".eliminar").css({
                'color': 'red'
            });
        }
    });
    /**
     * @autor:godie007
     * @date: 2017/01/11 03:28
     * Al momento de presionar en el check superir se seleccionan todos lo checkbox para
     * luego ser eliminados
     **/
    $('#example-select-all').on('click', function() {
        // Obtener todas las filas con la búsqueda aplicada
        var rows = table.rows({
            'search': 'applied'
        }).nodes();
        // Active o desactive las casillas de verificación de todas las filas de la tabla
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
        if ($('input[type="checkbox"]', rows).is(":checked")) {
            $(".eliminar").css({
                'color': 'red'
            });
        } else {
            $(".eliminar").css({
                'color': 'black'
            });
            $(".eliminar").attr("disabled", "disabled");
        }
    });
}
function separar(x, simbolo) {
    if (x !== undefined && x !== '') {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, simbolo);
    }
    return '';
}
