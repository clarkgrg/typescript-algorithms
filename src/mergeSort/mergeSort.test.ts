import { mergeSort } from './mergeSort';

test('mergeSort', () => {
  expect(mergeSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
  expect(mergeSort([3, 4, 1, 2])).not.toEqual([2, 1, 3, 4]);
});
