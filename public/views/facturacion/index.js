var salida = [];
var aux = [];
var indice = 0;
var table;
var table2;
/**
 * @autor:godie007
 * @date: 2016/12/22 17:01
 * Esta funcion es para centrar el foco para seleccionar de la tabla de productos
 **/
function mostrarFoco() {
    setTimeout(function() {
        var seleccionados = false;
        if ($('#myModal1').is(':visible') && $("a[id^=producto]").length > 0) {
            for (var i = 0; i < $("a[id^=producto]").length; i++) {
                if ($("a[id^=producto]").eq(i).text() === "Seleccionar...") {
                    $("a[id^=producto]").eq(i).trigger('focus');
                    seleccionados = true;
                    break;
                }
            }
            if (seleccionados === false) {
                if ($('button#pagar').is(':visible')) {
                    $("#guardar").trigger('focus');
                }
            }
            if ($('#myModal3').is(':visible')) {
                if ($("#nombreC").val() === '' || $("#nombreC").val() === "0" ) {
                    $("#cli_existente").trigger('focus');
                } else {
                    if ($("#cedulaV").val() === ''||$("#cedulaV").val() === "0") {
                        $("#ven_existente").trigger('focus');
                    } else {
                        $("#guardarFactura").trigger('focus');
                    }
                }
            }
        }

    }, 300);
}

window.mostrarContenido = function(indice, valor, nombre) {
    $("#producto" + indice).attr("class", valor);
    $("#producto" + indice).text(nombre);
};
window.validarRepetido = function(nombre) {
    mostrarFoco();
    for (var i = 0; i < salida.length; i++) {
        if (salida[i].producto === nombre) {
            mensajeAdvertencia("El producto ya se encuentra en uso, por favor modifique solo la cantidad.");
            return true;
        }
    }
    return false;
};
window.notificarIngresoDeCliente = function() {
    mensajeExito("Cliente Ingesado Correctamente!");
    $("#nombreC").attr('style', "border-radius: 4px; border:#ccc 1px solid;width: 300px;");
    return false;
};
window.notificarIngresoDevendedor = function() {
    mensajeExito("Vendedor Ingesado Correctamente!");
    $("#cedulaV").attr('style', "border-radius: 4px; border:#ccc 1px solid;width: 300px;");
    return false;
};
window.validarCantidad = function(id, indice, nombre) {
    $.ajax({
        url: "/account/facturacion/producto",
        type: 'POST',
        data: {
            'id': id
        },
        error: function(respuesta) {
            
        },
        success: function(respuesta) {
            var cantidad = parseInt($("#example tbody").find("tr").eq(indice).find("td").eq(5).find("input").val());
            var cantidadExistente = parseInt(respuesta.cantidad);
            if (cantidad > cantidadExistente) {
                $("#pagar").attr("disabled", true);
                $("#actualizar2").attr("disabled", true);
                $('#in_can' + indice).attr('style', "border-radius: 5px; border:#FF0000 1px solid;");
                mensajeError("La cantidad existente en Inventario de " + nombre + " es menor.(Actual=" + cantidad + ",Existente=" + cantidadExistente + ")");
            } else {
                $("#pagar").attr("disabled", false);
                $("#actualizar2").attr("disabled", false);
                return false;
            }
        }
    });
};
window.actualizarValor = function(valor, indice, ident, producto) {
    var date = new Date();
    var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);
    var total = 0;
    valor = parseInt(valor);
    indice = parseInt(indice);
    var cantidad = parseInt($("#example tbody tr").eq(indice).find("td").eq(5).find("input").val());
    salida[indice] = {
        'indice': indice,
        'numeroFactura': $("label[name='numeroFactura']").text().trim(),
        'fecha': fecha,
        'valor': valor,
        'producto': producto,
        'precio': (valor * cantidad),
        'productoID': ident,
        'cantidad': cantidad,
        'estado': 'Activo',
        'usuario': $("#usuario").attr("class")
    };
    window.sessionStorage.setItem('Formulario', JSON.stringify(salida));
    mostrar(salida);
};

function openWindow(indice) {
    window.open("/account/facturacion/ventana/" + indice, "_blank", "height=600,width=400, status=yes,toolbar=no,menubar=no,location=no,left=300,top=200");
}

function openWindowCliente() {
    window.open("/account/facturacion/cliente/", "_blank", "height=600,width=400, status=yes,toolbar=no,menubar=no,location=no,left=300,top=200");
}

function openWindowNuevoCliente() {
    window.open("/account/facturacion/cliente/nuevo/", "_blank", "height=600,width=400, status=yes,toolbar=no,menubar=no,location=no,left=300,top=200");
}

function openWindowVendedor() {
    window.open("/account/facturacion/vendedor/", "_blank", "height=600,width=400, status=yes,toolbar=no,menubar=no,location=no,left=300,top=200");
}

function openWindowNuevoVendedor() {
    window.open("/account/facturacion/vendedor/nuevo/", "_blank", "height=600,width=400, status=yes,toolbar=no,menubar=no,location=no,left=300,top=200");
}

function separar(x, simbolo) {
    if (x !== undefined && x !== '') {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, simbolo);
    }
    return '';
}

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

function verificar() {
    if (salida.length > 0) {
        $("#pagar").show();
    } else {
        $("#pagar").hide();
    }
}

function eliminarR(id) {
    $(".alert").hide();
    if (confirm('Esta Seguro?')) {
        var salida = [];
        salida[0] = id;
        eliminar(salida);
    }
}

function eliminar(ids) {
    var temporal = [];
    var index = 0;
    for (var i = 0; i < salida.length; i++) {
        for (var j = 0; j < ids.length; j++) {
            if (salida[i] !== null) {
                if (salida[i].indice !== null) {
                    if (parseInt(salida[i].indice) === parseInt(ids[j]))
                        salida[i] = null;
                }
            }
        }
    }
    for (var s = 0; s < salida.length; s++) {
        if (salida[s] !== null) {
            temporal[index] = salida[s];
            index++;
        }
    }
    salida = temporal;
    mostrar(salida);
    verificar();
    window.sessionStorage.setItem('Formulario', JSON.stringify(salida));
    mostrarFoco();
}

function comprobarFormaDePago(forma_pago) {
    if (forma_pago === 'efectivo') {
        var label_dinero = "<div class='span2'>Ingreso:</div>";
        var input_dinero = "<input type='text' id='dinero_pagado' autofocus='autofocus' focus class='form-control' style='width: 300px;' onkeypress=' return event.charCode >= 48 && event.charCode <= 57;'></input>";
        var label_devuelta = "<div class='span2'>Devolución:</div>";
        var input_devuelta = "<input type='text' id='devuelta' disabled='disabled'></input>";
        $("#dinero").html(label_dinero + input_dinero + label_devuelta + input_devuelta);
        $("#dinero_pagado").keyup(function() {
            var valor = parseFloat($("#valorF").val());
            var devuelta = parseFloat($(this).val()) - valor;
            $("#devuelta").val(devuelta.toFixed(2));
        });
    } else {
        $("#dinero").html("");
    }
}
$(document).ready(function() {
    setTimeout(function() {
        $("#menuVenta").click();
        $("#in_v").css({
            'outline': 'none',
            'background-color': '#393a39',
            'color': 'white'
        });
        comprobarFormaDePago($("#forma_pago").val());
    }, 400);

    $("#forma_pago").change(function() {
        comprobarFormaDePago($(this).val());
    });

    $("#guardarFactura").click(function() {
        var mensaje = false;
        if ($("#forma_pago").val() === "-1") {
            mensajeError('Debe Seleccionar una "Forma de Pago"');
            $("#forma_pago").attr('style', "border-radius: 5px; border:#FF0000 1px solid;width: 300px;");
            mensaje = true;
        } else {
            $("#forma_pago").attr('style', "border-radius: 4px; border:#ccc 1px solid;width: 300px;");
        }
        if ($("#nombreC").val() === "") {
            mensajeError('Debe Seleccionar una "Cédula del Cliente"');
            $("#nombreC").attr('style', "border-radius: 5px; border:#FF0000 1px solid;width: 300px;");
            mensaje = true;
        } else {
            $("#nombreC").attr('style', "border-radius: 4px; border:#ccc 1px solid;width: 300px;");
        }
        if ($("#cedulaV").val() === "") {
            mensajeError('Debe Seleccionar una "Cédula del Vendedor"');
            $("#cedulaV").attr('style', "border-radius: 5px; border:#FF0000 1px solid;width: 300px;");
            mensaje = true;
        } else {
            $("#cedulaV").attr('style', "border-radius: 4px; border:#ccc 1px solid;width: 300px;");
        }
        if ($("#forma_pago").val() == "efectivo") {
            if ($("#dinero_pagado").val() === "") {
                mensajeError('Debe Seleccionar una "Cédula del Vendedor"');
                $("#dinero_pagado").attr('style', "border-radius: 5px; border:#FF0000 1px solid;width: 300px;");
                mensaje = true;
            } else {
                $("#dinero_pagado").attr('style', "border-radius: 4px; border:#ccc 1px solid;width: 300px;");
            }
        }
        if (parseInt($("#devuelta").val()) < 0) {
            mensaje = true;
            mensajeError("Saldo Ingresado es menor al valor de la lista de compras!");
        }
        if (mensaje === false) {
            var date = new Date();
            var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);
            $.ajax({
                url: "/account/facturacion/",
                type: 'POST',
                data: {
                    'data': salida,
                    'usuario': $("#usuario").attr("class"),
                    'descuento': $("#descuento").val(),
                    'forma_pago': $("#forma_pago").val(),
                    'dinero_pagado': $("#dinero_pagado").val(),
                    'cliente': $("#nombreC").val(),
                    'vendedor': $("#cedulaV").val(),
                    'fecha': fecha,
                    'numeroFactura': $("label[name='numeroFactura']").text().trim(),
                    'fechaModificacion': ''
                },
                error: function(respuesta) {
                    
                },
                success: function(respuesta) {
                    
                    table2.ajax.reload(null, true);
                    $("#example_wrapper").hide();
                    $("#pagar").hide();
                    $("#print").click();
                    mensajeExito("Se Facturo!.");
                    setTimeout(function() {
                        if (confirm('Desea Imprimir?')) {
                            window.open('/imprimir/' + $("#example2 tbody tr").eq(0).find("td").eq(0).find("input").attr("class"), '_blank');
                        }
                        window.sessionStorage.setItem('Formulario', '[]');
                        location.reload();
                    }, 500);
                }
            });
        }
    });
    $("#actualizar").hide();
    $(".alert").hide();
    $("#guardar").show();

    $("#descuento").change(function() {
        var calculo = parseInt($("#valorT").text()) - (parseInt($(this).val()) / 100) * (parseInt($("#valorT").text()));
        $("#valorF").val(calculo.toFixed(2));
        $("#dinero_pagado").val(calculo.toFixed(2));
        var devuelta = 0;
        $("#devuelta").val(devuelta.toFixed(2));

    });
    $("#cancelar").click(function() {
        window.sessionStorage.setItem('Formulario', '[]');
        location.reload();
    });
    verificar();
    $("#pagar").click(function() {
        var productoInvalido = false;
        for (var i = 0; i < salida.length; i++) {
            if (salida[i].productoID === -1) {
                productoInvalido = true;
            }
        }
        // se verifica si todos los items de la lista de productos tienen elementos seleccionandos por el elemento tipo popup
        if (productoInvalido) {
            mensajeError("Debe seleccionar Productos en todos los registros.", "Importante!");
        } else {
            //se muestra modal de forma de pago
            var valor = parseInt($("#sumatoria").val());
            $("#valorT").text(valor);
            valor = parseInt(valor) - (parseInt($("#descuento").val()) / 100) * valor;
            $("#valorF").val(valor);
            $("#dinero_pagado").val($("#valorF").val());
            var dev = 0;
            $("#devuelta").val(dev.toFixed(2));
            $('#myModal3').modal('show');
        }
    });
    $("#ingresar").click(function() {
        $("#guardar").show();
        $("#actualizar").hide();
        $("input,textarea").val("");
        $(".alert").hide();
        $('#myModal').on('shown', function() {
            $("input[name='nombre']").focus();
        });
    });
    $("#guardar").click(function() {
        //se busca la cantidad existentel producto
        var existeEnLista = false;
        if (salida !== undefined) {
            for (var i = 0; i < salida.length; i++) {
                if (salida[i].productoID === $("#ddlNames").val()) {
                    existeEnLista = true;
                }
            }
        }
        if (existeEnLista === false) {
            var producto = parseInt($("#ddlNames option:selected").attr("class"));
            var mayor = -1;
            if (salida !== undefined) {
                for (var f = 0; f < salida.length; f++) {
                    if (salida[f] !== undefined) {
                        if (salida[f] !== null) {
                            if (salida[f].indice > mayor) {
                                mayor = salida[f].indice;
                            }
                        }
                    }
                }
            }
            var date = new Date();
            var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);
            salida[mayor + 1] = {
                'indice': (mayor + 1),
                'fecha': fecha,
                'producto': "Seleccionar...",
                'precio': producto,
                'productoID': -1,
                'valor': 0,
                'cantidad': 1,
                'estado': 'Activo'
            };
            mostrar(salida);
            verificar();
            //window.sessionStorage.setItem('Formulario', JSON.stringify(salida));
        } else {
            alert("El producto ya Existe");
        }
    });
});

function mostrar(salida) {
    table = $('#example').DataTable({
        "data": salida,
        "columns": [{
            "data": "indice",
            title: "<input type='checkbox' id='example-select-all'>"
        }, {
            "data": "indice",
            title: "N°"
        }, {
            "data": "fecha",
            title: "Fecha"
        }, {
            "data": "producto",
            title: "Producto",
            render: function(data, type, row) {
                var x = '<a  href="#" "name"="' + row.indice + '" autofocus onClick="openWindow(' + row.indice + ')"  class="" id="producto' + row.indice + '" >' + data + '</a>';
                return x;
            }
        }, {
            "data": "valor",
            title: "Valor"
        }, {
            "data": "cantidad",
            title: "Cantidad",
            render: function(data, type, row) {
                $("#in_can" + row.indice).change(function() {
                    if (salida[row.indice].valor !== '') {
                        var date = new Date();
                        var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);
                        salida[row.indice].cantidad = $(this).val();
                        salida[row.indice].precio = parseInt(salida[row.indice].valor) * parseInt($(this).val());
                        salida[row.indice].fecha = fecha;

                        comprovarCantidadesR();

                        window.sessionStorage.setItem('Formulario', JSON.stringify(salida));
                        mostrar(salida);
                    }
                });
                return '<input id ="in_can' + row.indice + '" type="number" step="1" min="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57;" max="10000" value="' + data + '">';
            }
        }, {
            "data": "precio",
            title: "Precio",
            render: function(data, type, row) {
                return separar(data + '', ',');
            }
        }, {
            "data": "estado",
            title: "Estado"
        }, {
            "data": "indice",
            title: "Acción",
            render: function(data, type, row) {
                return '<div class="btn-group"><img type="button" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhUlEQVRIS72VSy5FQRCGvzvAAjDxTCSGYsIKrMAjEo81uFiI5xIQEq8VWAETMSWEMMEGTMgv3VIp55w+59zcW8Ou6v+v+qu7qkGbrdFmfFIE3cACMAtMAwMhoTfgGrgEzoCvvESLCAS8DQwlqnwBNoDzrLgsAp0JuFlRvt1A9G3vZRHs1ACPmLqrav7ME0iW04qZ+/B54CIeWgI19MFp/g6sAXtAv0OKvn2gz/iegfHYeEuwDBw5kCXgBJgArgyJwGeAO2AFOHT3hHWsM0sgaSSRNQsUSeSP4JOBuNfdE9aiJ3gCRjP09yQKUeZ54PI/AmOeQJ+lK6fBlkQhReDyC6un4wRlJFLmsts6EqWaHGWJTS4iyWxy0TP1mn+GlySSVeCgzDPVR7sHhk3wB7AOaM74pygS+TQerC/3owlX31zjtxWbC2P8F6Pjwy6SboXyq1QiqTaB5LiOoCpVe2EkwSLN1Qttt39WZmWqL1qZU8BgQHgFbgKoNlmtlVlFntzYVAUtk/wAB7peGclDh8AAAAAASUVORK5CYII=" onClick="eliminarR(&#39;' + data + '&#39;)" class="btn btn-default fa fa-trash-o" ></img></div>';
            }
        }],
        'columnDefs': [{
            'targets': 0,
            'searchable': false,
            'orderable': false,
            'className': 'dt-body-center',
            'render': function(data, type, full, meta) {
                if (true) {}
                return '<input type="checkbox" class="' + $('<div/>').text(data).html() + '">';
            }
        }],
        fnFooterCallback: function(nRow, aaData, iStart, iEnd, aiDisplay) {
            var api = this.api();
            var size = 0;
            aaData.forEach(function(x) {
                if (x.estado === 'Activo') {
                    size += (x.precio);
                }
            });
            if ($("#example tfoot").length === 0) {
                $('#example').append('<tfoot><tr><th>Total</th><th></th></tr></tfoot>');
            }
            $("#example tfoot tr th").eq(1).text("$" + separar(size + '', ','));
            $("#sumatoria").val(size);
        },
        "destroy": true,
        select: true,
        responsive: true,
        altEditor: true,
        dom: 'Bfrtip',
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
                text: 'Mostrar Columnas',
                postfixButtons: ['colvisRestore'],
                extend: 'colvis'
            },
            {
                text: 'Eliminar Selección',
                className: 'eliminar',
                action: function(e, dt, node, conf) {
                  var total = 0;
                  temporal = [];
                  var s = 0;
                  var ides = [];
                  var inputs = $("#example tbody tr").find("td").find("input[type='checkbox']:checked");
                  for (var i = 0; i < inputs.length; i++) {
                      if (inputs.eq(i).is(":checked")) {
                          if (inputs.eq(i).attr("class") !== null) {
                              ides[s] = inputs.eq(i).attr("class");
                              s++;
                          }
                      }
                  }
                  if (inputs.length > 0) {
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
                          toastr.warning("Los inventarios se han Eliminado!.", "Importante!");
                          eliminar(ides);
                      }
                  } else {
                      mensajeError("Debe checkear elementos de la lista para poder eliminarlos.");
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
                    },
                    //download: 'open',
                    customize: function(doc) {

                        doc.content.splice(1, 0, {
                            margin: [0, 0, 0, 12],
                            alignment: 'center',
                            image: 'data:image/png;base64,' + $("#imagen").attr("class") + '='
                        });
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

    $("select[id*=ddlNames]").customselect();
    $("select[id*=ddlNames]").customselect({
        "csclass": "custom-select", // Class to match
        "search": true, // Is searchable?
        "numitems": 4, // Number of results per page
        "searchblank": false, // Search blank value options?
        "showblank": true, // Show blank value options?
        "searchvalue": false, // Search option values?
        "hoveropen": false, // Open the select on hover?
        "emptytext": "", // Change empty option text to a set value
        "showdisabled": false // Show disabled options
    });
    $('#example-select-all').on('click', function() {
        // Get all rows with search applied
        var rows = table.rows({
            'search': 'applied'
        }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

}

function mensajeError(msj) {
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-center" || 'toast-top-right',
        preventDuplicates: false,
        timeOut: "5000",
        onclick: null
    };
    //success error warning info
    toastr.error(msj, "Advertencia!");
}

function mensajeExito(msj) {
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-center" || 'toast-top-right',
        preventDuplicates: false,
        timeOut: "1000",
        onclick: null
    };
    //success error warning info
    toastr.success(msj, "Felicidades!");
}

function mensajeAdvertencia(msj) {
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-center" || 'toast-top-right',
        preventDuplicates: false,
        timeOut: "5000",
        onclick: null
    };
    toastr.warning(msj, "Importante!");
}

function mensajeInformacion(msj) {
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-center" || 'toast-top-right',
        preventDuplicates: false,
        timeOut: "5000",
        onclick: null
    };
    toastr.info(msj, "Felicidades!");
}

function comprovarCantidadesR() {
    for (var m = 0; m < salida.length; m++) {
        var nombre = $("#example tbody").find("tr").eq(m).find("td").eq(3).text();
        if (nombre !== "Seleccionar...") {
            var id = salida[m].productoID;

            $.ajax({
                url: "/account/facturacion/producto",
                type: 'POST',
                data: {
                    'id': id,
                    'indice': m
                },
                error: function(respuesta) {
                    
                },
                success: function(respuesta) {
                    var indice = respuesta.indice;
                    if (respuesta !== undefined) {
                        var cantidad = parseInt($("#example tbody").find("tr").eq(indice).find("td").eq(5).find("input").val());
                        var cantidadExistente = parseInt(respuesta.cantidad);

                        if (cantidad > cantidadExistente) {

                            $("#pagar").attr("disabled", true);
                            $("#actualizar2").attr("disabled", true);
                            $('#in_can' + indice).attr('style', "border-radius: 5px; border:#FF0000 1px solid;");
                            mensajeError("La cantidad existente en Inventario de " + nombre + " es menor.(Actual=" + cantidad + ",Existente=" + cantidadExistente + ")");
                        } else {
                            $("#pagar").attr("disabled", false);
                            $("#actualizar2").attr("disabled", false);
                            return false;
                        }
                    } else {
                        mensajeError("El producto " + nombre + " fue retirado de inventario.");
                    }
                }
            });
        }
    }
}
/**
 * Seccion de la segunda Tabla
 **/
function ver2(id) {
    $.ajax({
        url: "/account/facturacion/ver/",
        type: 'POST',
        data: {
            'id': id
        },
        error: function(respuesta) {
            
        },
        success: function(respuesta) {
            $("#id").val(respuesta._id);
            salida = respuesta.data;
            aux = respuesta.data;
            mostrar(salida);
            $("#actualizar2").show();
            $("#guardarFactura").hide();
            verificar();
            $("#facturar").click();
            $('#myModal2').modal('hide');
        }
    });
}

function eliminar2(id) {
    if (confirm('Esta Seguro?')) {
        $(".alert").hide();
        $.ajax({
            url: "/account/facturacion/",
            type: 'DELETE',
            data: {
                'id': id
            },
            error: function(respuesta) {
                
            },
            success: function(respuesta) {
                if (respuesta !== '') {
                    mensajeAdvertencia("La Factura ha sido Anulada!.");
                    table2.ajax.url("/account/facturacion/listar/").load();
                }
            }
        });
    }
}
$(document).ready(function() {
    if (window.sessionStorage.getItem('Formulario') !== null) {
        if (JSON.parse(window.sessionStorage.getItem('Formulario')).length > 0) {
            salida = JSON.parse(window.sessionStorage.getItem('Formulario'));
            mostrar(salida);

        }
    }
    setTimeout(function() {
        comprovarCantidadesR();
    }, 1000);

    verificar();
    $("#actualizar2").hide();
    $("#actualizar2").click(function() {
        $.ajax({
            url: "/account/facturacion/",
            type: 'PUT',
            data: {
                '_id': $("#id").val(),
                'vendedor': $("#cedulaV").val(),
                'cliente': $("#nombreC").val(),
                'descuento': $("#descuento").val(),
                'dinero_pagado': $("#dinero_pagado").val(),
                'data': salida
            },
            error: function(respuesta) {
                
            },
            success: function(respuesta) {
                if (respuesta !== '') {
                    
                    table2.ajax.url("/account/facturacion/listar/").load();
                    mensajeInformacion("Se ha Actualizado la Factura!.");
                }
            }
        });
    });
    var contador = 0;
    table2 = $('#example2').DataTable({
        "ajax": {
            "url": "/account/facturacion/listar",
            "dataSrc": ""
        },
        "order": [
            [1, "desc"]
        ],
        "columns": [{
            "data": "_id",
            title: "<input type='checkbox' id='example-select-all2'>"
        }, {
            "data": "numeroFactura",
            title: "N° Factura"
        }, {
            "data": "fecha",
            title: "Fecha de Creación"
        }, {
            "data": "fechaModificacion",
            title: "Fecha de Modificación"
        }, {
            "data": "usuario",
            title: "Usuario"
        }, {
            "data": "data",
            title: "Valor",
            render: function(data, type, row) {
                var total = 0;
                for (var i = 0; i < data.length; i++) {
                    total += data[i].precio;
                }
                return '$' + separar(total + '', ',');
            }
        }, {
            "data": "estado",
            title: "Estado",
            render: function(data, type, row) {
                if (row.estado === 'Anulado') {
                    return '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACLklEQVRIS7XVSajPURQH8M8zRYYkhVKiDKGMhSQrZWFakGRhgWR4JYqsrCiSRMoUUoaForBAEooUFoREGRMbG9PC2Hnd97puv////Rfe2d17zznfe7/ne85t0sHW1MH5NQIwGPMwEQPwC29wBxfxud4l6wEMwQ4sQqcaSb5gH7bha5VPLYA5OIk+WdATjE7rFxiKzmn9DHPxvASpAojk59Alc96K/mhOe1fSBY7TRvNHTMPLHKQECFoeZjf/ic24jtvongUvQDccQ8+0/wBTEHEtVgKcweIsyWH0wMIiebj8xiU8xaYsZjUOVAGEWl7XKOg77MEu/MCalKS1BjkrUYcRVQARtD/zvJok+RbbcRpT03mo5hrWJnoGYVwWOxaPS4qOYHmhmkPJcUVB3R9sSfWagVXol8Uuw4kS4AJCQf/DQhg7S4DzmF8je3TvXYT+u2ICRtW5yUbsLgH2ZjrPYwN4fRJAvj8dBzGmAii6/2wJsASnCuejCP6D8yqLTr+B8dlh+IYi35cAvdNmr+T8AcPwvZ2iBF3RYK12EzNbF2WjhRxDHWEh2XVZYN/U4dFgn/AtO3uEkGbYbFyuBRAtfx8j0yh+hcmJ53hhbjF7IvG9NOiiFkHx0typatgNx600+9th55/jmFWzipfV/HBiFIcK4pNpxOLmK8vkZZHLRDGuQ0EbEK8qLdQSL426tXFeOjXyZUZM8DsJA9Moji8zKGmRYj1rFKC9PDXPOxzgL+vhahnrzWfrAAAAAElFTkSuQmCC" >' + x.precio;
                } else {
                    return '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAE+UlEQVRIS7WVa2wUVRTH/3dmdva92+2DtoBtofIqUlIWlvKUIkLkoVjCwxAiYhAC1AbEDwZJMGLUYHzhI0gRNaSEpqY8JYFKEWgBC20FWmmFUi2tbWFfs7Od7s7OjJntQli6UL9wk/Nl7p3zu+f8z7mH4Akv8oT9o19AydfGFJ114Hir2TQjFFIyaQKKouT2gN9/vt3ddeHVDb6mx13ysYBTByesG5Set9FiTc/UsiCsRgZFgggERIgBGYLnbmdby7mySYt+X08I5FigmICSErDp8fnHM4bNyYuzEAJFBAgBlBAUWYAi+6HIHEggiKCQiOabNc1c+9VZz67++9bDkJiAs8fmXhw3camDoXgQ2gQQLaBmUxHvO1ckDxTJDcrnAy0no+lGfdvtWzXT5hR0RkH6AKpOPPfVyGcWrTdog6AYG9xeBoWbi7CpcDFyxqZBkTicLK/CgdIqfP7RFOhlHjTHAVIyrrXU14zL/83+YBRRgNKigTn2SavOpiZbjIQygjCJ+PjTU9i6bRdmz56KXw5uhyK5MGZ8Ia43tuL7b/KxbF48aM4bNj89GrX1h9+c8frNnfcgUYCLx14uHjnW/gqrVUAxCSB0It7YsA8//HQYQ4ekoal+HxTJCUP8YohiCFveno0tBWmgvb0AWjTgCk/qG7vLxi5ZAkmFRAHqfl3aNCJ79DAoUgQQjw92VOC97XswMy8XJ45ugyx5kZWzCTdutuG7nUuwYoEJFMf1QgIELWSwv6Ju/6hVbwmtUYBvd5gGzJq6smFwui4BNANC20DoONxxabB6/R68s3kxch2pgMzj0LFrKD5Qhd1fTIQp5AHl48I6UEI3nHGTca72x+cXrnOWRwF27zBmz5u19ozN4rbKehMoxgpCWUAoA0DpACiRMu2GIvNQJB8Q9IDmfRGADyQkgjdm4XTDkVUL1t7ZGwXY9ZkhdaZ9xbW0AVI8J4nwBlgMGpwEQvQA0USyqfZBIFyqCPGguv2geB58lxfcXQHpCYArbjIqL+2d+2KB+3gfDWqO5jdnZwwYIlEenGlgoDPKsOckA4TpLQpFBpQAIAZACUI4Jd4OH45UBrFycghEo8dtkiaUXynOem1jT0sfQHXpzJ+znhqaz5IOyHoj9lcwuHXbi4VzrBg+VA8KMkgoBBIMgncLOHdZwIUGBVtfUqAnPKBPwVUfaTzfXjZmzRqIfQAln9imTncsO5mkNOsUDaCwelS3pqCorBN+gSAlSQeGpsDxIpyeAGZkG7E61wkdPOEA/TYHaq9XbJ228ur2mH2gfrxUbN83KsOxXM/VQdGwUBgGsiYOTc5EtDq1CEkEcdogRie4YCNtYeHVJZuHoa7r30Z7fvnIR3ayulFQAO3yXMcfEzLHj6DcNf9vXJifRqPL6zpdXTl/7fuuC70l17sefosMAMzZo9ikL991lI7LtI8w8w2A6IsNIgx6zFlo7Oy4u6f4zJqdpR71RuphDoihgeocgCVi5qJtGYXTc6e/kGSx2rSyH1pZAKWI6KHNCFIG+IWAUP3n5drNn1758K9mqf0B5yqkO1YEdASigkwAjHlT2OHzJ6ZOGp6ZYjeaLcmEaAjv93raOroajlf+c/7QyUBdxBkP4J7dD/lRE00FqenSA1DbmAWgdhvFsqCCwfD0Uh+zYMR6IhDhwfzHiqA/UdULqaaKeF/Ix/3U79Dvj9jf/n8ciQ83QfXpMwAAAABJRU5ErkJggg==" >'+row.estado;
                }
            }
        }, {
            "data": "_id",
            title: "Eventos",
            render: function(data, type, row) {
                var imprimir = '<img title="Esta función es para Imprimir el registro de la columna!" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEoElEQVRIS5WWXUwjVRTHz21num2hUMqHNUGIoQRoSwyVj5BAqe5ukRLeNoTEkBiNmuiDBg0J+AJPPhgfJH5E9HE1MasPomZXEkPENU13qanZQIOloSwBWqC0ZSm0M9O55kyZpi3FXW9zM9O5M//fOeeec2YIFA1KKfF6vS0sy+oBgOYv8zyf+0sIIWq1+thsNq8TQjLFOvJ/UrwQCASuLC8v3+zr67smCIIgiiLIM5PJ5M5FUSSU0phGo3nPZrMtPDFgaWlJfXBw8OPQ0JATLU6n04BHhMgAhUIh6TEMA4lEYpPjuNc6OzuXSkEueICAvb29hcHBwesoFIvF4OzsDCilOetlgFqthpqaGtjZ2VlTqVSvtLS03C+GlATs7+8vuFyu62jx6emp5EV+qORzlUoF5eXlkmeBQODPurq6GxaLJZwPeSIAx3EFHiAAvcAQoTghBL2IEkKu9vf3//2/AIlEQvICRVBYDhUe5YleRCKRKMMwV3t6eh4PCIfDUohQEAGpVEoSw5EPwHUcVVVVcHh4GOV5/nIA5v/GxoYqGAyWRaPRW06n80WWZSVxDIM85A2WrcfruNm7u7tHuw8fupwu10p+XUh7cHR0VHnv3so7GcL2x2NR1dPGGmunrcOAIiePTiDNpaUQARDQaDTAsoxUghR/lAJu9sHBIf+H+y9fpV6/b9CpvhsYGPgWQRLg7t3f32TKjJ8SVsv89MNNqKuuAmu7FahIIc1xeR6QgtLGqMkATOcH/+xAS0cfVMJhpL6uYqS7u/s+ViPjdru/SbFPjYaPUnDyKAFpTgCRAvAZEQRBBAGPOEWsBQoZUd7gLEDeG4WSAfaKFjoaGNDR2LsvDQ9/QgKBQEUiFvs5zFX2/+LeArxfyKCIWCR0WTM4v46xOPfoBWsFNFamPnY6ne+T1dVVw/Hx8W2D8dnu37zbcJq+tG+VJFCa36tEUDEA7c+ooYzhvrDb7W+R9fX1mng8fqetre15Oc8fY2tuGcODfYrjeOB4DrAgBZ6DVCqN7eUru93+BoaoNhaL3WltbbXJef0kABTH9EXRLCQLwImpnU6nv3Y4HK9fAGCey1X7XyA0Jl9YEASpZ8mT5/nSgMXFRfD5fFBfXw9arbaAIWeMnDXoAU60OBQKQWNjI/T29gLCRFHMhsjv91fH4/HbFoulCxemp6fB4/HA1NQUWK3WXP+5zBv0OBKJwOzsLBgMBpiYmJAiIAjC5w6H422yvb2t2drautXe3j6MN/v9fskDtKa6urogzy+DJJNJWFtbo3q9HpqamgjuQyKRmB4ZGflQqmS3231tY2PjRjAYVKrV6qra2tohk8mkLQ5RyTcWIVLc/X4/v7m5+Ws8Ht81Go2JsbGxL5ubm4MX3gcmk8kxOTm50NXVpcMeI8c924tKDwytz+fj5+bmXvZ6vd+f3yWVeO4p7KYoMj4+/qrdbv9MqVQqikWlG7Itu+BrA6/hR4DH4/lgfn7+I1wmhBQCZmZmmFAoxGQymecopbZkMqlIJpNKnucZQRCUlFKcyMAHqUKhyDAMI7AsK+h0OlGn0+Hig4aGhhWz2cyPjo5KLeFfbFAuRnCHY/gAAAAASUVORK5CYII=" type="button" id="imprimir" onclick="window.open(&#39;/imprimir/' + data + '&#39;, &#39;myWindow&#39;, &#39;width=800,height=600&#39;)"class="btn btn-default fa fa-print">';
                var editar = '<img title="Esta función es para Modificar el registro de la columna!" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEJUlEQVRIS7XUaUxcVRQH8P+9b5mBGaAMDAgFSqFA0Rq1otVih0Uje0ywqR+MidYFqyZuYYbR2OBSNps0VhMT0doYUxNM1bBpoi3TGk3oYrBVWwkBWgYoywADszBv3rvXTBNDkbYUTN+X9+G+c3733nfOIbjJD7nJ+bEUsHbdB8ILQakBjP0JRf8t9m31r3Yji4EaR7VBv0aIkbNbOQd1zw88NKdMbuPQatGYd3Y1yAJg/+lWqskPp5i39VCKEZUjjijQPPxihsvdvxNBXclqTrIA2By7DLqE3ihDplMSEaOqfjYxfaZS5fMeBtUFLpRgYOIRfL1DW8lJFgBr10sGfeI5szFTnfQNEo+/vwqcfQAi7AAnv4bLCYpPHbOgwVINEH6jyJVAjkj1ZVGGjWddnp5SUOwFI3aEiW+JPmRBoHcI0M0FiVdmdZYPVw6AE9gcH1MQE6PqPqjC4yCSPd2cG0Z0mO8bcZQIRDISyCkcyu9a/QPf3AiyuIpqW2R4Yw9AIDAZY+1T7nFzcmzhJS5hWiBYc2H02JOyHHUOqpqjUf95rc7y5XLI0j6o7TLCT/ZHims/8fDxJyRR/0PgnbvbUup52kU7BmBzNEWErzuuqu4sf3BWQIOl6Xr/5OqdHELm8VF0eFrzrM+5U2Pq3nUJlhmjGy6PYX7t0PTJN6KM6Qf93skNijq3iTXmWq+FXHtU1PwcDU2tT4nPbXa6up9lPNCUZHpQcFajL6Z+NMvl7rUnGjfXzShDBb7gRAQa8t+/2nVdfxbZHfeLRCoy6+9sG/Odft4gmQ7Ovbvpl1Ai4+6+Ao/i3J5kym0Zc5++K8j8g6gv+O6/yPLDzup4ShSlxDhjzuFLs92vMwHN2GM5kVrL9YP+4xmUkxfi4+5pGJ/87T2NBb9AU/6PVyLLA6GvrUcrQcnmFNOW752Tp15kErdhT97Q5URvHrkXKrVSKvcwLRCJpkLryoFQhP3oFsrFZ6J1Gc3Tyt+vMj/fBYncLgi0Kkyf/Kmndr0DNkcjGvNtqwNCUTVdG0DwismQeWjK0/scOD+zPqLgsELhGVba/Zg31KChcPfqgcvXdSwbhH0OkLdvico7BSMwNXwyToH3M3B+CE2F+/8fEIq2HdkKkO0A5ZSKLqaqr4HyGBD+NBoKDywLtLS0yJGRkTGapsUGAoERnU6XGB8ff350dDSVMZYqSVI3ALOqqtlfOfVzf8wIj474tYScaFb78kY2XlpaOvEvsqiK2traHgNQBSCVEBJa83HO+wkhw4yxLM55gFKaxBhzUkoDAJIBhN4q5zyGEDLDOQ/Np2FZlk8UFxePLinT9vb2tPLy8v7W1tbbKioq/iKE8M7OTnNYWNi0oig6r9err6ysdHV0dGSKojhcVFTk7ezsTOecq2VlZRdW3mjLjctl1v8ByA6+KFA/i54AAAAASUVORK5CYII=" onclick="ver2(&#39;' + data + '&#39;)" type="button" class="btn btn-default fa fa-edit " ></img>';
                var eliminar = '<img title="Esta función es para Eliminar el registro de la columna!" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABhUlEQVRIS72VSy5FQRCGvzvAAjDxTCSGYsIKrMAjEo81uFiI5xIQEq8VWAETMSWEMMEGTMgv3VIp55w+59zcW8Ou6v+v+qu7qkGbrdFmfFIE3cACMAtMAwMhoTfgGrgEzoCvvESLCAS8DQwlqnwBNoDzrLgsAp0JuFlRvt1A9G3vZRHs1ACPmLqrav7ME0iW04qZ+/B54CIeWgI19MFp/g6sAXtAv0OKvn2gz/iegfHYeEuwDBw5kCXgBJgArgyJwGeAO2AFOHT3hHWsM0sgaSSRNQsUSeSP4JOBuNfdE9aiJ3gCRjP09yQKUeZ54PI/AmOeQJ+lK6fBlkQhReDyC6un4wRlJFLmsts6EqWaHGWJTS4iyWxy0TP1mn+GlySSVeCgzDPVR7sHhk3wB7AOaM74pygS+TQerC/3owlX31zjtxWbC2P8F6Pjwy6SboXyq1QiqTaB5LiOoCpVe2EkwSLN1Qttt39WZmWqL1qZU8BgQHgFbgKoNlmtlVlFntzYVAUtk/wAB7peGclDh8AAAAAASUVORK5CYII="type="button" onclick="eliminar2(&#39;' + data + '&#39;)" class="btn btn-default fa fa-trash-o" ></img>';
                if (row.estado === 'Anulado') {
                    eliminar = '';
                    editar = '';
                }
                return '<div class="btn-group" >' + imprimir + editar + eliminar + '</div>';
            }
        }],
        'columnDefs': [{
            'targets': 0,
            'searchable': false,
            'orderable': false,
            'className': 'dt-body-center',
            'render': function(data, type, row, meta) {
                if (row.estado === 'Anulado') {
                    return '<input disabled type="checkbox" class="' + $('<div/>').text(data).html() + '">';
                }
                return '<input type="checkbox" class="' + $('<div/>').text(data).html() + '">';
            }
        }],
        fnFooterCallback: function(nRow, aaData, iStart, iEnd, aiDisplay) {
            var api = this.api();
            var size = 0;
            aaData.forEach(function(x) {
                if (x.estado === 'Activo') {
                    for (var i = 0; i < x.data.length; i++) {
                        size += x.data[i].precio;
                    }
                }
            });
            if ($("#example2 tfoot").length === 0) {
                $('#example2').append('<tfoot><tr><th>Recaudado:</th></th><th></tr></tfoot>');
            }
            $("#example2 tfoot tr th").eq(1).text("$" + separar(size + '', ','));
        },
        "destroy": true,
        select: true,
        responsive: true,
        altEditor: true,
        dom: 'Bfrtip',
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
                            }
                        };
                        //success error warning info
                        toastr.warning("Los inventarios se han Eliminado!.", "Importante!");
                        $("input[type='checkbox']").each(function() {
                            if ($(this).is(":checked")) {
                                $.ajax({
                                    url: "http://" + window.location.hostname + ":" + window.location.port + "/account/" + $("#modulo").attr("class") + "/",
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
                }
            },
            {
                extend: 'collection',
                text: 'Exportar',
                buttons: [{
                    extend: 'pdfHtml5',
                    exportOptions: {
                        columns: ':not(:last-child)'
                    },
                    //download: 'open',
                    customize: function(doc) {

                        doc.content.splice(1, 0, {
                            margin: [0, 0, 0, 12],
                            alignment: 'center',
                            image: 'data:image/png;base64,' + $("#imagen").attr("class") + '='
                        });
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

    $('#example-select-all2').on('click', function() {
        // Get all rows with search applied
        var rows = table2.rows({
            'search': 'applied'
        }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });
    $("#deleteAll2").click(function() {
        var inputs = $("#example2 tbody tr").find("td").find("input[type='checkbox']:checked");
        if (inputs.length > 0) {
            if (confirm('Esta Seguro?')) {
                inputs.each(function() {
                    if ($(this).is(":checked")) {
                        $.ajax({
                            url: "http://" + window.location.hostname + ":" + window.location.port + "/account/facturacion/",
                            type: 'DELETE',
                            data: {
                                'id': $(this).attr("class")
                            },
                            error: function(respuesta) {
                            },
                            success: function(respuesta) {
                                mensajeAdvertencia("La Factura ha sido Anulada!.");
                                table2.ajax.reload(null, true); // user paging is not reset on reload
                            }
                        });
                    }
                });
            }
        } else {
            mensajeError("Debe checkear elementos de la lista para poder Anular las Facturas.");
        }
    });
});
