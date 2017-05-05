var treeJson = JSON.parse($("#entrada").attr("class"));

construirArbol(treeJson);
function construirArbol(arbol) {
  $.jstree.defaults.core.themes.variant = "small";
  var tree = $('#jstree').jstree({
      'core': {
          "check_callback": true,
          'data': arbol,
          "animation" : 100
      },

      "plugins": [
          "contextmenu",
          "dnd",
          "massload",
          "search",
          "state",
          "themes",
          'crrm',
          "json_data",
          "ui"
      ],
      "contextmenu": {items: context_menu}
  }).on("select_node.jstree",function(evt, data){
    $("a").click(function(event) {
      var id  = $(this).parent().attr("id");
      var treeLink = $(this).attr("href");
      $("#id").val(id);
      $("#ruta").val(treeLink);
    });
  });
}
function actualizarRuta() {
  var tree = $('#jstree').jstree(true);
  var arbol = tree.get_json('#', {flat:true});
  for (var i = 0; i < arbol.length; i++) {
    if (arbol[i].id === $("#id").val()) {
      arbol[i].a_attr.href=$("#ruta").val();
    }
  }
  tree.settings.core.data = arbol;
  setTimeout(function() {
    tree.refresh();
  },10);
}
function almacenar() {
  var tree = $('#jstree').jstree(true);
  var informacion = tree.get_json('#', {flat:true});
  $.ajax({
    url: window.location.pathname,
    type: 'DELETE',
    success: function(err,resultado) {
      for (var i = 0; i < informacion.length; i++) {
        $.ajax({
          url: window.location.pathname,
          type: 'POST',
          data: informacion[i]
        });
      }
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
      toastr.success("Se ha Guardado el Menu.", "Felicidades!");
    }
  });

}
function context_menu(node){
	var tree = $('#jstree').jstree(true);

	// The default set of all items
    var items = {
        "Create": {
            "separator_before": false,
            "separator_after": false,
            "label": "Ingresar",
            "action": function (obj) {
                var $node = tree.create_node(node);
                tree.edit($node);
            }
        },
        "Rename": {
            "separator_before": false,
            "separator_after": false,
            "label": "Renombrar",
            "action": function (obj) {
                tree.edit(node);
            }
        },
        "Remove": {
            "separator_before": true,
            "separator_after": false,
            "label": "Eliminar",
            "action": function (obj) {
            	if(confirm('Esta Seguro?')){
            		tree.delete_node(node);
            	}
            }
        }
    };


    return items;
}
