var assert = require('assert');
var engine = require('../../../public/views/grafica/engine');

describe('Engine', function() {
  describe('#calculatePercentage', function() {
    it('should return 100% when everything is full', function() {
      assert.equal(100, engine.calculatePercentage(30949.293313144917));
    });

    it('should return 0% when area is 0', function() {
      assert.equal(0, engine.calculatePercentage(0));
    });
  });

  describe('#calculateLevel', function() {
    var doc = {
      ask: [
        { min: 1, max: 10, nivel: 1},
        { min: 11, max: 20, nivel: 2},
        { min: 21, max: 30, nivel: 3},
        { min: 31, max: 40, nivel: 4},
        { min: 41, max: 50, nivel: 5},
      ]
    };

    it('should return level 1', function() {
      assert.equal(1, engine.calculateLevel(doc, 5));
    });

    it('should return level 2', function() {
      assert.equal(2, engine.calculateLevel(doc, 15));
    });
  });
});
