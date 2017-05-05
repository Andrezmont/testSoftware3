jQuery(document).ready(function($) {
    $.ajax({
        url: "/account/formulario/vendedor/",
        type: 'POST',
        error: function(respuesta) {
            
        },
        success: function(respuesta) {

            if (respuesta.length > 0) {
                window.sessionStorage.setItem('formData', JSON.stringify(JSON.stringify(respuesta)));
            }

            //var almacenados = respuesta.length > 0 ? JSON.stringify(JSON.stringify(respuesta)) : window.sessionStorage.getItem('formData');
            var almacenados =JSON.stringify(JSON.stringify(respuesta));
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

            var formBuilder = $(buildWrap).formBuilder(fbOptions).data('formBuilder');
            toggleEdit();
            $(renderWrap).formRender({
                dataType: 'json',
                formData: formBuilder.formData
            });

            $("input[id^='file-']:visible").each(function() {
                var id = $(this).attr("id").split("-")[1];

                $(".field-file-" + id).append('<div id="imagen' + id + '"></div>')
                $("#file-" + id).change(function() {
                    encodeImageFileAsURL(this, id);
                })
            })

            $('.form-builder-save').click(function() {
                toggleEdit();
                $(renderWrap).formRender({
                    dataType: 'json',
                    formData: formBuilder.formData
                });
                window.sessionStorage.setItem('formData', JSON.stringify(formBuilder.formData));
                var datos = JSON.parse(formBuilder.formData);

                $.ajax({
                    url: "/account/vendedorTodo/",
                    type: 'DELETE',
                    error: function(respuesta) {
                        
                    },
                    success: function(respuesta) {
                        
                    }
                });


                setTimeout(function() {
                    for (var i = 0; i < datos.length; i++) {
                        var entrada = datos[i];
                        entrada.indice = i;
                        entrada.usuario = $("#usuario").attr("class");
                        entrada.modulo = $("#modulo").attr("class");
                        $.ajax({
                            url: "/account/vendedor/dinamica/",
                            type: 'POST',
                            data: datos[i],
                            error: function(respuesta) {
                                
                            },
                            success: function(respuesta) {
                                
                            }
                        });
                    }
                }, 500);

            });

            editBtn.onclick = function() {
                toggleEdit();
            };
        }
    });
var hilo = function() {
  if ($(".fld-className.form-control:visible").length === 1) {
    $(".form-group.className-wrap").hide();
    $(".form-group.name-wrap").hide();
    clearInterval(hilo);
  }
}
$(".close-field").click(function() {
    setInterval(hilo,200);
});
setInterval(hilo,200);

});
