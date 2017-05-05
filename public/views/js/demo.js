jQuery(document).ready(function($) {
  $.ajax({
      url: "/account/formulario/",
      type: 'POST',
      error: function(respuesta) {
          
      },
      success: function(respuesta) {

        if (respuesta.length > 0) {
          window.sessionStorage.setItem('formData', JSON.stringify(JSON.stringify(respuesta)));
        }


        var almacenados = respuesta.length > 0 ? JSON.stringify(JSON.stringify(respuesta)):window.sessionStorage.getItem('formData');
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
                url: "/account/clienteTodo/",
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
                    url: "/account/cliente/dinamica/",
                    type: 'POST',
                    data: datos[i],
                    error: function(respuesta) {
                        
                    },
                    success: function(respuesta) {
                        
                    }
                });
              }
            },500);

        });

        editBtn.onclick = function() {
            toggleEdit();
        };
      }
  });


});

function tomarValores() {
    var json = '[{';
    json += '"usuario":"' + $("#usuario").attr("class") + '",';
    json += '"campos":[';

    var inputs = $('input[type=date]:visible,input[type=file]:visible,input[id^="number-"]:visible,input[id^="text-"]:visible,textarea[id^="textarea-"]:visible,select[id^="select-"]:visible,input[id^="radio-group-"]:checked:visible,input[id^="checkbox-"]:checked:visible');


    for (var i = inputs.length - 1; i >= 0; i--) {
        if (inputs.eq(i).length > 0) {

            var titulo = inputs.eq(i).parent().find("label").text().trim();
            var valor = inputs.eq(i).val() === '' ? ' ' : inputs.eq(i).val();

            if (inputs.eq(i).attr("id").indexOf("radio-group") !== -1) {
                titulo = inputs.eq(i).parent().parent().find("label").eq(0).text().trim();
                valor = inputs.eq(i).is(':checked');
            }

            if (inputs.eq(i).attr("id").indexOf("checkbox") !== -1) {
                if (inputs.eq(i).attr("id").indexOf("checkbox-group") !== -1) {
                    titulo = inputs.eq(i).parent().parent().find("label").eq(0).text().trim();
                    valor = inputs.eq(i).is(':checked');
                } else {
                    titulo = inputs.eq(i).parent().find("label").eq(0).text().trim();
                    valor = inputs.eq(i).is(':checked');
                }
            }

            if (inputs.eq(i).attr("id").indexOf("select-") !== -1) {
                valor = inputs.eq(i).find("option:selected").val();
            }
            if (inputs.eq(i).attr("id").indexOf("file-") !== -1) {
                var id = inputs.eq(i).attr("id").split("-")[1];
                valor = '<img src=' + $("#imagen" + id + " img").prop("src") + ' style=height:80px;width:80px;>';
            }



            json += '{"id":"' + inputs.eq(i).attr("id") + '",';
            json += '"titulo":"' + titulo + '",';
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

function encodeImageFileAsURL(file, index) {

    var filesSelected = file.files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        if (!fileToLoad.name.match(/\.(jpg|jpeg|png|gif|tiff|bmp|ico)$/)) {
            alert('El archivo que intenta subir no es una Imgen');
        } else {
            if (fileToLoad.size / 1024 <= 30) {


                var fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent) {
                    var newImage = document.createElement('img');
                    var srcData = fileLoadedEvent.target.result; // <--- data: base64
                    newImage.src = srcData;
                    document.getElementById("imagen" + index).innerHTML = newImage.outerHTML;
                }
                fileReader.readAsDataURL(fileToLoad);
            } else {
                alert("Disculpe, No se permiten Imagenes mayores a 30 kb!");
            }
        }
    }
}
