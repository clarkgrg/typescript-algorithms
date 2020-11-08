import { quickSort } from './quickSort';

test('quickSort', () => {
  expect(quickSort([3, 4, 1, 5, 2, 7, 9])).toEqual([1, 2, 3, 4, 5, 7, 9]);
  expect(quickSort([3, 4, 1, 5, 2, 7, 9])).not.toEqual([2, 1, 3, 4, 5, 7, 9]);
});
