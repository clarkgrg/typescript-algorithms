import { Queue } from './queue';

test('queue', () => {
  const s = new Queue<number>();
  s.enqueue(10);
  s.enqueue(5);
  expect(s.size()).toEqual(2);
  expect(s.dequeue()).toEqual(10);
  expect(s.dequeue()).toEqual(5);
  expect(s.dequeue()).toBeUndefined();
});
