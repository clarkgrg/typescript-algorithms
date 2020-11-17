import { Stack } from './stack';

test('stack', () => {
  const s = new Stack<number>();
  s.push(10);
  s.push(5);
  expect(s.size()).toEqual(2);
  expect(s.pop()).toEqual(5);
  expect(s.pop()).toEqual(10);
  expect(s.pop()).toBeUndefined();
});
