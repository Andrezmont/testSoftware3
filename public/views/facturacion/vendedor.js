function encodeImageFileAsURL(file, index) {

    var filesSelected = file.files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        if (!fileToLoad.name.match(/\.(jpg|jpeg|png|gif|tiff|bmp|ico)$/)) {
            alert('El archivo que intenta subir no es una Imgen');
        } else {
            if (fileToLoad.size/1024 <= 1024) {

                var fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent) {
                    var newImage = document.createElement('img');
                    var srcData = fileLoadedEvent.target.result; // <--- data: base64
                    newImage.src = srcData;
                    document.getElementById("imagen" + index).innerHTML = newImage.outerHTML;
                }
                fileReader.readAsDataURL(fileToLoad);
            } else {
                alert("Disculpe, No se permiten Imagenes mayores a 1 MB!");
            }
        }
    }
}

function validarCampos() {
    var inputs = $('input[class^=txt],textarea[class^=txt]');
    var bandera = true;
    for (var i = 0; i < inputs.length; i++) {

        var entrada = inputs.eq(i).parent().find("label").text().trim();
        if (entrada === "Cantidad" || entrada === "Valor" || entrada === "Nombre") {
            if (inputs.eq(i).val() === "") {
                inputs.eq(i).css("border", "1px solid red");
                bandera = false;
            } else {
                inputs.eq(i).css("border", "1px solid #ccc");
                bandera = true;
            }
        }
    }
    return bandera;
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

$( document ).ready(function() {
  $("#guardar").click(function() {
      //if (validarCampos()) {
          $.ajax({
              url: "/account/vendedor/",
              type: 'POST',
              data: {
                  'data': tomarValores(),
                  "_csrf": csrftoken,
                  "modulo": "vendedor",
                  'usuario': $("#usuario").attr("class")
              },
              error: function(respuesta) {
                  
              },
              success: function(respuesta) {
                  if (respuesta != '') {
                    var inputs = $('input[id^=number]:visible');
                    for (var i =  0; i < inputs.length; i++) {
                        if (inputs.eq(i).parent().find("label").text().trim() === "Cedula") {
                          window.opener.document.getElementById('cedulaV').value = inputs.eq(i).val();
                          window.opener.notificarIngresoDevendedor();
                          window.close();
                        }
                    }
                  }
              }
          });
      //}
  });
  function getCookie(name) {
       var cookieValue = null;
       if (document.cookie && document.cookie !== '') {
           var cookies = document.cookie.split(';');
           for (var i = 0; i < cookies.length; i++) {
               var cookie = jQuery.trim(cookies[i]);
               // Does this cookie string begin with the name we want?
               if (cookie.substring(0, name.length + 1) === (name + '=')) {
                   cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                   break;
               }
           }
       }
       return cookieValue;
   }
  var csrftoken = getCookie('_csrfToken');

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
              "_csrf": csrftoken ,
              "modulo":$("#modulo").attr("class")
            },
            error: function(respuesta) {
                
            },
            success: function(respuesta) {
              
                if (respuesta.length > 0) {
                    window.sessionStorage.setItem('formData', JSON.stringify(JSON.stringify(respuesta)));
                }

                var almacenados = respuesta.length > 0 ? JSON.stringify(JSON.stringify(respuesta)) : window.sessionStorage.getItem('formData');
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

});
