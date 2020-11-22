import { DoublyLinkedList } from './doublelist';

test('double linked list', () => {
  const list = new DoublyLinkedList<number>();
  [1, 2, 4, 7].map((x) => list.add(x));
  list.add(9);

  expect(list.dequeue()).toEqual(1);
  expect(list.dequeue()).toEqual(2);
  expect(list.pop()).toEqual(9);
});
