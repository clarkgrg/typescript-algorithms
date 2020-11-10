import { insertionSort } from './insertionSort';

test('insertionSort', () => {
  expect(insertionSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
  expect(insertionSort([3, 4, 1, 2])).not.toEqual([2, 1, 3, 4]);
});
