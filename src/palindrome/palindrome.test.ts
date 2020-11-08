import { isPalindrome, isPalindrome2 } from './palindrome';

test('palindrome', () => {
  expect(isPalindrome('madam')).toBeTruthy();
  expect(isPalindrome('civil')).toBeFalsy();
  expect(isPalindrome2('madam')).toBeTruthy();
  expect(isPalindrome2('civil')).toBeFalsy();
});
