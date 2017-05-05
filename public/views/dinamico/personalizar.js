$(document).ready(function() {
  var formBuilder;
    $.ajax({
        url: "/admin/formulario/" + $("#modulo").attr("class") + "/",
        type: 'POST',
        success: function(respuesta) {
            if (respuesta.length > 0) {
                window.sessionStorage.setItem('formData', JSON.stringify(JSON.stringify(respuesta)));
            }
            var almacenados = JSON.stringify(JSON.stringify(respuesta));
            var buildWrap = document.querySelector('.build-wrap'),
                renderWrap = document.querySelector('.render-wrap'),
                editBtn = document.getElementById('edit-form'),
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
            function almacenarCampos() {
                /**
                 * @autor:godie007
                 * @date: 2016/12/24 01:35
                 * Se eliminan los anteriores campos
                 **/
                $.ajax({
                    url: "/admin/" + $("#modulo").attr("class") + "Todo/",
                    type: 'DELETE',
                    success: function(respuesta) {
                        /**
                         * @autor:godie007
                         * @date: 2016/12/24 01:10
                         * Se ingresan registros de nuevos campos en base de datos
                         **/
                        var datos = JSON.parse(formBuilder.formData);
                        for (var i = 0; i < datos.length; i++) {
                            var entrada = datos[i];
                            entrada.indice = i;
                            entrada.usuario = $("#usuario").attr("class");
                            entrada.modulo = $("#modulo").attr("class");
                            entrada.empresa = $("#empresa").attr("class");
                            $.ajax({
                                url: "/admin/" + $("#modulo").attr("class") + "/dinamica/",
                                type: 'POST',
                                data: entrada
                            });
                        }
                    }
                });
            }
            formBuilder = $(buildWrap).formBuilder(fbOptions).data('formBuilder');
            toggleEdit();
            $(renderWrap).formRender({
                dataType: 'json',
                formData: formBuilder.formData
            });
            $("input[id^=date-]").addClass("form-control").attr('type', 'datetime-local');
            $("input[id^='file-']:visible").each(function() {
                var id = $(this).attr("id").split("-")[1];
                $(".field-file-" + id).append('<div id="imagen' + id + '"></div>');
                //$("#file-" + id).change(function() {
                //    encodeImageFileAsURL(this, id);
                //});
            });
            $(".field-label").each(function() {
                var nombre = $(this).text();
                if (nombre === 'Nombre' ||
                    nombre === 'Valor' ||
                    nombre === 'Cedula' ||
                    nombre === 'Cantidad') {
                    $(this).parent().find(".field-actions").remove();
                }
            });
            $('.form-builder-save').click(function() {
                /**
                 * @autor:godie007
                 * @date: 2016/12/24 01:17
                 * Se actualiza el nuevo nombre de los campos modificados en el formulario
                 * de drag and drop
                 **/
                var inputs = $('input[name="label"]');
                var formulario = JSON.parse(JSON.parse(window.sessionStorage.getItem('formData')));
                if (formulario !== null) {
                    /**
                     * @autor:godie007
                     * @date: 2017/12/30 17:53
                     * Se busca si cambio alguno de los campos dinamicos para actualizar en base de datos
                     * los registro que tenian el anterior nombre
                     **/
                    for (var i = 0; i < inputs.length; i++) {
                        var valorActual = $(inputs[i]).val();
                        var indice = parseInt($(inputs[i]).attr("id").split("fld-")[1]) - 1;
                        var valorAnterior = $(inputs[i]).val();
                        if (formulario[indice] !== undefined) {
                            valorAnterior = formulario[indice].label;
                        }
                        if (valorAnterior !== valorActual) {
                            $.ajax({
                                url: "/admin/" + $("#modulo").attr("class") + "/nombrar",
                                type: 'PUT',
                                data: {
                                    'valorActual': valorActual,
                                    'valorAnterior': valorAnterior,
                                    'usuario': $("#usuario").attr("class")
                                }
                            });
                        }
                    }
                }
                /**
                 * @autor:godie007
                 * @date: 2016/12/24 01:45
                 * Se actualiza el Formulario Dinamico
                 **/
                toggleEdit();
                $(renderWrap).formRender({
                    dataType: 'json',
                    formData: formBuilder.formData
                });
                window.sessionStorage.setItem('formData', JSON.stringify(formBuilder.formData));
                setTimeout(function() {
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
                    toastr.success("Se Modifico Exitosamente!", "Felicidades!");
                }, 100);
                almacenarCampos();
            });
            editBtn.onclick = function() {
                toggleEdit();
            };
        }
    });
    /**
     * @autor:godie007
     * @date: 2017/01/02 11:50
     * Se usa un hilo para ocultar los campos innesesarios del Builder Plugin
     * con el objetivo de hacer mas simple la interfaz a lo usuarios Finales
     **/
    var hilo = function() {
        if ($(".fld-className.form-control:visible").length === 1) {
            $(".form-group.className-wrap").hide();
            $(".form-group.name-wrap").hide();
            $(".form-group.other-wrap").hide();
            clearInterval(hilo);
        }
    };
    $(".close-field").click(function() {
        setInterval(hilo, 200);
    });
    setInterval(hilo, 200);
});
