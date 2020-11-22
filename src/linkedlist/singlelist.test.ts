import { LinkedList } from './singlelist';

test('single linked list', () => {
  const list = new LinkedList<number>();
  [1, 2, 4, 7].map((x) => list.add(x));
  expect(list.dequeue()).toEqual(1);
  expect(list.dequeue()).toEqual(2);
});
