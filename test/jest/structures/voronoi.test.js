import '@babel/polyfill';

import processStructure from '@devoinc/applications-data-library/structures/voronoi';

/**
 * This test check the voronoi structure
 */

describe('Voronoi data structure: ', () => {
  describe('Process basic structure', () => {
    let data = require('./data/voronoi/basic.json');
    let result = processStructure(
      data,
      ['site', 'country', 'city', 'isp'],
      ['count'],
      null
    );

    test('Should have kKeys array as given', () => {
      expect(result.kKeys.keys).toEqual(['site', 'country', 'city', 'isp']);
    });

    test('Should have kval value as given', () => {
      expect(result.kval.value).toEqual(['count']);
    });

    test('Should have data lines as given', () => {
      expect(result.data[0][0]).toBe('www-logtrust');
      expect(result.data[1][0]).toBe('DZ');
      expect(result.data[2][0]).toBe('Béchar');
      expect(result.data[3][0]).toBe('Telecom Algeria');
      expect(result.data[4][0]).toBe('4');
      expect(result.data[5][0]).toBe('site');
    });
  });
});
