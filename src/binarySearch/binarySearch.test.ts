import { binarySearch } from './binarySearch';

test('binarySearch', () => {
  expect(binarySearch([1, 2, 3, 4],1)).toEqual(0);
  expect(binarySearch([1, 2, 3, 4],5)).toEqual(-1);
  expect(binarySearch([1, 2, 3, 4],4)).not.toEqual(2);
});