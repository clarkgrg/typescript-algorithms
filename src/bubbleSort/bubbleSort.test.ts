import { bubbleSort } from './bubbleSort';

test('bubbleSort', () => {
  expect(bubbleSort([3, 4, 1, 2])).toEqual([1, 2, 3, 4]);
  expect(bubbleSort([3, 4, 1, 2])).not.toEqual([2, 1, 3, 4]);
});
