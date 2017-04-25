function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function calculateArea(arreglo) {
  var areaActual = 0;
  var angulo = 360 / arreglo.length;
  for (var h = 0; h < arreglo.length; h++) {
      var a = arreglo[h];
      var b = arreglo[h + 1];
      if (h < arreglo.length - 1) {
          a = arreglo[h];
          b = arreglo[h + 1];
      } else {
          a = arreglo[h];
          b = arreglo[0];
      }
      var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * Math.cos(toRadians(angulo)));

      var s1 = (a + b + c) / 2;
      var area = Math.sqrt(s1 * (s1 - a) * (s1 - b) * (s1 - c));
      areaActual += area;
  }

  return areaActual;
}

function calculatePercentage(areaActual,aristas) {
  var array = [];
  for (var i = 0; i < aristas; i++) {
    array[i] = 100;
  }
  var areaTotal = calculateArea(array); // area total de 21 indicadores
  return 100 - Math.abs(((areaActual - areaTotal) / areaTotal) * 100);
}

function calculateLevel(doc, p_total) {
  var level;
  for (var i = 0; i < doc.ask.length; i++) {
      if (p_total >= doc.ask[i].min && p_total <= doc.ask[i].max) {
        level = doc.ask[i].nivel;
        break;
      }
  }

  return level;
}

function calculateEdges(data) {
  var labels = [];
  var values = [];
  for (var i = 0; i < data.length; i++) {
      labels.push(data[i].titulo);

      // se hace el calculo del procentaje para cada areista de la grafica radial
      var calculo1 = Math.abs(parseInt(100 * (parseInt($("#ent" + i).val()) - data[i].min) / (data[i].max - data[i].min)));
      values.push(calculo1);
  }
  return {
    labels: labels,
    values: values,
  };
}

var engine = {
  calculateArea: calculateArea,
  calculatePercentage: calculatePercentage,
  calculateLevel: calculateLevel,
  calculateEdges: calculateEdges,
};

if ( typeof window !== 'undefined' && window ) {
  window.engine = engine;
}

if ( typeof module !== 'undefined' && module ) {
  module.exports = engine;
}
