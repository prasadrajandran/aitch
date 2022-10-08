import { h } from '../dist/index';

describe('h.js', () => {
  test('dummy test', () => {
    expect(h('div', 'node')).toMatchSnapshot('node');
  });
});
