var assert = require('assert');
var engine = require('../../../public/views/grafica/engine');

describe('Engine', function() {
  /**
  * @autor:godie007
  * @date: 2017/04/17 14:22
  * se realizan las pruebas unitarias para el metodo Calcular Procentaje
  * @param area estimada
  **/
  describe('#calculatePercentage', function() {
    it('should return 100% when everything is full', function() {
      assert.equal(100, engine.calculatePercentage(30949.293313144917,21));
    });

    it('should return 0% when area is 0', function() {
      assert.equal(0, engine.calculatePercentage(0,21));
    });
  });

  /**
  * @autor:godie007
  * @date: 2017/04/17 14:05
  * se realizan las pruebas unitarias para el metodo Calcular Area
  * @param arreglo con los valores de las aristas de la grafica
  **/
  describe('#calculateArea', function() {
    var arreglo = [1,2,3,4];
    it('if array [1,2,3,4] is equals 12.000000000000002', function() {
      assert.equal(12.000000000000002, engine.calculateArea(arreglo));
    });
  });
  /**
  * @autor:godie007
  * @date: 2017/04/17 14:54
  * se realizan las pruebas unitarias para el metodo Calcular Nivel que consisten en
  * identificar en que nivel se encuentra la empresa
  * @param valor a estimar
  **/
  describe('#calculateLevel', function() {
    var doc = {
      ask: [
        { min: 1, max: 20, nivel: 1},
        { min: 21, max: 40, nivel: 2},
        { min: 41, max: 60, nivel: 3},
        { min: 61, max: 80, nivel: 4},
        { min: 81, max: 100, nivel: 5},
      ]
    };

    it('should return level 1', function() {
      assert.equal(1, engine.calculateLevel(doc, 5));
    });
    it('should return level 2', function() {
      assert.equal(2, engine.calculateLevel(doc, 25));
    });
    it('should return level 3', function() {
      assert.equal(3, engine.calculateLevel(doc, 45));
    });
    it('should return level 4', function() {
      assert.equal(4, engine.calculateLevel(doc, 65));
    });
    it('should return level 5', function() {
      assert.equal(5, engine.calculateLevel(doc, 85));
    });
  });
});
