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
    if (confirm('Esta Seguro?')) {
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
                    if (confirm('Esta Seguro?')) {
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
                    exportOptions: {
                        columns: ':not(:last-child)'
                    }

                }, {
                    extend: 'csvHtml5',
                    exportOptions: {
                        columns: ':not(:last-child)'
                    }
                }, {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: ':not(:last-child)'
                    }
                }, {
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
