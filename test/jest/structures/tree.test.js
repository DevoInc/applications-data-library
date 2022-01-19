import '@babel/polyfill';

import processStructure from '@devo/applications-data-library/structures/tree';

/**
 * This test check the tree structure
 */

describe('Tree data structure: ', () => {
  describe('Process basic structure', () => {
    let data = require('./data/tree/basic.json');
    let result = processStructure(
      data,
      ['srcIp', 'dstIp', 'dstPort', 'fwname'],
      'count'
    );

    test('Should have kKeys array as given', () => {
      expect(result.kKeys.keys).toEqual([
        'srcIp',
        'dstIp',
        'dstPort',
        'fwname',
      ]);
    });

    test('Should have kval value as given', () => {
      expect(result.kval.value).toBe('count');
    });

    test('Should have data lines as given', () => {
      expect(result.data[0]).toEqual([
        '192.168.8.4',
        '209.249.181.21',
        '123',
        'pa-820',
        '1',
      ]);
    });
  });
});
