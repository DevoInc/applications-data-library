import '@babel/polyfill';

import dataConversor from '@devo/applications-data-library/utils/dataConversor';

/**
 * This test check dataConversion process
 */

describe('Data Conversion to dataMatrix: ', () => {
  describe('Process from json format', () => {
    let response = require('./data/conversion/serreaFormatJson');
    let result = dataConversor(response);

    it('Should have kKeys array as given', () => {
      expect(result.keys).toEqual([
        { name: 'col1', type: 'key' },
        { name: 'col2', type: 'key' },
      ]);
    });

    it('Should have data lines as given', () => {
      expect(result.dataMatrix[0]).toEqual(['v11', 'v12']);
      expect(result.dataMatrix[1]).toEqual(['v21', 'v22']);
    });
  });
  describe('Process from json compact format', () => {
    let response = require('./data/conversion/serreaFormatJsonCompact');
    let result = dataConversor(response);

    it('Should have kKeys array as given', () => {
      expect(result.keys).toEqual([{ name: 'count', type: 'float8' }]);
    });

    it('Should have data lines as given', () => {
      expect(result.dataMatrix[0]).toEqual([0]);
    });
  });
  describe('Process from csv format', () => {
    let response = require('./data/conversion/serreaFormatCSV');
    let result = dataConversor(response);

    it('Should have kKeys array as given', () => {
      expect(result.keys).toEqual([{ name: 'srcip4', type: 'key' }]);
    });

    it('Should have data lines as given', () => {
      expect(result.dataMatrix[0]).toEqual(['10.12.115.71']);
      expect(result.dataMatrix[1]).toEqual(['10.16.50.165']);
      expect(result.dataMatrix[2]).toEqual(['208.118.237.69']);
    });
  });
});
