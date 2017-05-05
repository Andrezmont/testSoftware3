function encodeImageFileAsURL(file, index) {

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
                }
                fileReader.readAsDataURL(fileToLoad);
            } else {
                alert("Disculpe, No se permiten Imagenes mayores a 30 kb!");
            }
        }
    }
}
function limpiarCampos() {
  var camps = $('input[type=date]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id*="checkbox"]:not([id*="preview"]):not([id*="group"])');
  camps.each(function() {
    $(this).val("");
  });
}
function ver(id) {

    $("#id").val(id);
    $('#myModal').show();
    $('.modal-backdrop').show();
    $.ajax({
        url: "/account/vendedor/ver/",
        type: 'POST',
        data: {
            'id': id
        },
        error: function(respuesta) {
            
        },
        success: function(respuesta) {
            limpiarCampos();
            for (var i = 0; i < respuesta.campos.length; i++) {
                var valor = respuesta.campos[i].valor;
                var id = respuesta.campos[i].id;
                var tipo = respuesta.campos[i].id.split("-")[0];
                var tipo2 = respuesta.campos[i].id.split("-")[0]+"-"+respuesta.campos[i].id.split("-")[1];
                if (tipo === 'textarea') {
                    $("#" + id).val(valor);
                }
                if (tipo === 'file') {
                    var id2 = respuesta.campos[i].id.split("-")[1];
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
                  valor = valor==='true' ? true:false;
                  if(valor !== actual){
                    $("#" + id).prop("checked", valor);
                    $("#" + id).trigger('click');
                  }

                }

                if (tipo2 === 'checkbox-group') {
                    var ids = respuesta.campos[i].id.split("/*");
                    for (var s = 0; s < ids.length; s++) {
                      $("#" + ids[s]).prop("checked", true);
                    }
                }


            }
            $("#actualizar").show();
            $("#guardar").hide();
        }
    });
}

function eliminar(id) {
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
            }
        };
        //success error warning info
        toastr["warning"]("El vendedor se ha Eliminado!.", "Importante!");
        $.ajax({
            url: "/account/vendedor/",
            type: 'DELETE',
            data: {
                'id': id
            },
            error: function(respuesta) {
                
            },
            success: function(respuesta) {
                if (respuesta != '') {
                    mostrarTabla();
                }
            }
        });
    }
}

function generarCampos() {
    setTimeout(function() {
        $("input[id^='file-']:not([id$='preview'])").each(function() {
            var id = $(this).attr("id").split("-")[1];

            $(".field-file-" + id).append('<div id="imagen' + id + '"></div>')
            $("#file-" + id).change(function() {
                encodeImageFileAsURL(this, id);
            })
        })
    }, 100);
    $.ajax({
        url: "/account/formulario/vendedor/",
        type: 'POST',
        data:{
          'modulo':$("#modulo").attr("class")
        },
        error: function(respuesta) {
            
        },
        success: function(respuesta) {
          
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

        }
    });
    setTimeout(function(){
      mostrarTabla();
    },500)
}

function calcularCamposDinamicos() {


    var json = '[';

    var inputs = $('input[type=date]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id*="checkbox"]:not([id*="preview"]):not([id*="group"])')
    var inputs2 = $('div[class*="field-checkbox-group"]:not([class*="preview"])');
    for (var i = 0; i < inputs2.length; i++) {
        json += '{';
        var label = inputs2.eq(i).text().split(" ")[0].trim();
        json += '"label":"' + label.replace("?", "") + '",'
        json += '"valor":""'
        json += '},';
    }
    for (var i = 0; i < inputs.length; i++) {
        json += '{';
        var label = inputs.eq(i).parent().find("label").text().trim();
        if (inputs.eq(i).parent().find("label").length > 1) {
            label = inputs.eq(i).parent().parent().find("label").eq(0).text().trim();
        }
        if (inputs.eq(i).parent().find("label").length = 0) {
            label = inputs.eq(i).parent().parent().find("label").text()
        }

        json += '"label":"' + label.replace("?", "") + '",'
        json += '"valor":""'
        json += '}';
        if (i < inputs.length - 1) {
            json += ',';
        }
    }

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

    for (var i = 0; i < arreglo.length; i++) {
        cadena += '{"data": "' + arreglo[i].label + '","title": "' + arreglo[i].label + '"}';
        if (i !== arreglo.length - 1) {
            cadena += ',';
        }
    }
    cadena += ']';
    var elementos = JSON.parse(cadena);

    for (var i = 0; i < elementos.length; i++) {
        salida.push(elementos[i]);
    }
    salida.push({
        "data": "_id",
        title: "Acción",
        render: function(data, type, row) {
            return '<div class="btn-group"><button onClick="ver(&#39;' + data + '&#39;)" type="button" data-toggle="modal" data-target="#myModal" class="btn btn-default" >Editar</button><button type="button" onClick="eliminar(&#39;' + data + '&#39;)" id="' + data + '"class="btn btn-default" >Eliminar</button></div>';
        }
    });
    return salida;
}

function tomarValores() {
    var json = '[{';
    json += '"campos":[';
    var inputs2 = $('div[class*="field-checkbox-group"]:not([class*="preview"])');

    for (var i = 0; i < inputs2.length; i++) {
        var items =$(inputs2[i]).find("label");
        var entra =$(inputs2[i]).find("input");
        json += '{';
        var acomulado = '';
        var ids = '';
        for (var s = 1; s < items.length; s++) {
          var data = $(items[s]).text().trim();
          if ($(entra[s-1]).is(":checked")) {
            acomulado += data+'<br>';
            ids +=$(entra[s-1]).attr("id");
          }
          if (data !=='') {
            if (s < items.length - 1) {
                ids += '/*';
            }
          }
        }

        var label = inputs2.eq(i).text().split(" ")[0].trim();
        json += '"titulo":"' + label.replace("?", "") + '",'
        json += '"valor":"'+acomulado+'",'
        json += '"id":"'+ids+'"'
        json += '},';
    }
    var inputs = $('input[type=date]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id*="checkbox"]:not([id*="preview"]):not([id*="group"])');

    for (var i = inputs.length - 1; i >= 0; i--) {
        if (inputs.eq(i).length > 0) {

            var titulo = inputs.eq(i).parent().find("label").eq(0).text().trim();
            var valor = inputs.eq(i).val() === '' ? ' ' : inputs.eq(i).val();

            if (inputs.eq(i).attr("id").indexOf("radio-group") !== -1) {
                titulo = inputs.eq(i).parent().parent().find("label").eq(0).text().trim();
                var num = inputs.eq(i).attr("id").split("-")[3];
                valor = inputs.eq(i).parent().find("label").eq(num).text().trim();
            }

            if (inputs.eq(i).attr("id").indexOf("select-") !== -1) {
                valor = inputs.eq(i).find("option:selected").val();
            }
            if (inputs.eq(i).attr("id").indexOf("file-") !== -1) {
                var id = inputs.eq(i).attr("id").split("-")[1];
                var img = $("#imagen" + id + " img").prop("src");
                if (img === undefined || img === '') {
                  img = '/images/default.png';
                }
                valor = '<img src=' + img + ' style=height:80px;width:80px;>';
            }
            if (inputs.eq(i).attr("id").indexOf("checkbox-") !== -1) {
                if (inputs.eq(i).parent().find("label").length === 0) {
                  titulo =  inputs.eq(i).parent().parent().find("label").text().trim()
                }else{
                  titulo = inputs.eq(i).parent().find("label").text().trim();
                }


                valor = $("#"+inputs.eq(i).attr("id")).is(':checked');
            }

            json += '{"id":"' + inputs.eq(i).attr("id") + '",';
            json += '"titulo":"' + titulo.replace("?", "") + '",';
            json += '"valor":"' + valor + '"}';
            if (i > 0) {
                json += ',';
            }
        }
    }
    json += ']}';
    json += ']';

    var sa = JSON.parse(json)[0];
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

        $.ajax({
            url: "/account/vendedor/",
            type: 'POST',
            data: {
                'data': tomarValores(),
                'usuario': $("#usuario").attr("class"),
                'modulo': $("#modulo").attr("class")
            },
            error: function(respuesta) {
                
            },
            success: function(respuesta) {
                if (respuesta != '') {
                    toastr.options = {
                        closeButton: true,
                        debug: false,
                        newestOnTop: false,
                        progressBar: true,
                        positionClass: "toast-top-center" || 'toast-top-right',
                        preventDuplicates: false,
                        timeOut: "1000",
                        onclick: function() {
                        }
                    };
                    //success error warning info
                    toastr["success"]("Se ha Guardado el Producto.", "Felicidades!");
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
            }
        };
        //success error warning info
        toastr["info"]("Actualizado Correctamente.", "Felicidades!");
        $.ajax({
            url: "/account/vendedor/",
            type: 'PUT',
            data: {
                '_id': $("#id").val(),
                'data': tomarValores()
            },
            error: function(respuesta) {
                
            },
            success: function(respuesta) {
                if (respuesta != '') {
                    $(".alert").show();
                    mostrarTabla();
                }
            }
        });

    });

});

function mostrarTabla() {
    $.ajax({
        url: "/account/vendedor/listar/",
        type: 'GET',
        error: function(respuesta) {
            
        },
        success: function(respuesta) {
            //
            mostrar(respuesta);
        }
    });
}


function mostrar(entrada) {
    // se hace la adaptacion dinamica a la tabla
    var temp = entrada;
    var inputs = $('input[type=date]:not([id*="preview"]),input[type=file]:not([id*="preview"]),input[id^="number-"]:not([id*="preview"]),input[id^="text-"]:not([id*="preview"]),textarea[id^="textarea-"]:not([id*="preview"]),select[id^="select-"]:not([id*="preview"]),input[id^="radio-group-"]:checked:not([id*="preview"]),input[id^="checkbox-"]:not([id*="preview"])');
    // se expande dinamicamente los campos que no existen ahun en base de datos
    for (var i = 0; i < temp.length; i++) {
        for (var s = 0; s < inputs.length; s++) {
          var label = inputs.eq(inputs.length - 1 -s).parent().find("label").eq(0).text().trim();
          if (inputs.eq(s).parent().find("label").length > 1) {
            label = inputs.eq(inputs.length - 1 -s).parent().parent().find("label").eq(0).text().trim();
          }
          if (inputs.eq(i).parent().find("label").length = 0) {
            label = inputs.eq(inputs.length - 1 -s).parent().parent().find("label").eq(0).text().trim();
          }
          label = label.replace("?", "");
          if (temp[i] !== undefined) {
              if (temp[i][label] === undefined) {
                  temp[i][label] = '';
              }
          }
          if (temp[i] !== undefined && temp[i].campos[s] !== undefined && temp[i].campos[s].titulo != undefined) {
              temp[i][temp[i].campos[s].titulo] = temp[i].campos[s].valor;
          }
        }
    }


    table = $('#example').DataTable({
        "data": temp,
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }],
        "columns": calcularCamposDinamicos(),
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
        dom: 'T<"clear">lfrtip',
        tableTools: {
            "sSwfPath": "http://" + window.location.hostname + ":" + window.location.port + "/swf/copy_csv_xls_pdf.swf"
        }
    });
    if ($("#example tbody").find("tr").eq(0).find("td").eq(1).text() === "0") {
        $("#example_filter label").append("<button class='btn-danger' id='deleteAll'>Eliminar</button>");
    }

    $('#example-select-all').on('click', function() {
        // Get all rows with search applied
        var rows = table.rows({
            'search': 'applied'
        }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });
    $("#deleteAll").click(function() {
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
                }
            };
            //success error warning info
            toastr["warning"]("Los vendedores se han Eliminado!.", "Importante!");
            $("input[type='checkbox']").each(function() {
                if ($(this).is(":checked")) {
                    $.ajax({
                        url: "http://" + window.location.hostname + ":" + window.location.port + "/account/vendedor/",
                        type: 'DELETE',
                        data: {
                            'id': $(this).attr("class")
                        },
                        error: function(respuesta) {
                        },
                        success: function(respuesta) {
                            mostrarTabla();
                        }
                    });
                }
            });
        }
    });
}
