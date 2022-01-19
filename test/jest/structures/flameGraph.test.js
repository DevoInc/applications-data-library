import '@babel/polyfill';

import processStructure from '@devo/applications-data-library/structures/flameGraph';

describe('Flame graph data structure: ', () => {
  describe('processFromGraph test', () => {
    test('Should return null if no data is provided', () => {
      const data = null;
      let response = processStructure(data);
      expect(response).toBe(null);
    });

    test(`Should return an error if no weights and paths does not have the
      same length`, () => {
      const data = {
        keys: [
          { name: 'key1', type: 'key' },
          { name: 'key2', type: 'key' },
        ],
        dataMatrix: [['a', 1], ['b', 2], ['c']],
      };
      let response = processStructure(data, 'key1', 'key2');
      expect(response.error).toBe('Wrong data');
    });

    test(`Should return an object with same paths and weights if
        everything is correct`, () => {
      const data = {
        keys: [
          { name: 'key1', type: 'key' },
          { name: 'key2', type: 'key' },
        ],
        dataMatrix: [
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ],
      };
      const correctData = {
        path: ['a', 'b', 'c'],
        weight: [1, 2, 3],
      };
      let response = processStructure(data, 'key1', 'key2');
      expect(response instanceof Object).toBeTruthy();
      expect(Array.isArray(response.path)).toBeTruthy();
      expect(Array.isArray(response.weight)).toBeTruthy();
      expect(response).toEqual(correctData);
    });
  });
});
