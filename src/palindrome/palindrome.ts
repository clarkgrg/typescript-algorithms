/**
 * @module Palindrome solvers
 * A palindrome is a string that reads the same forward and backward, for example,
 * - radar, toot, madam.
 */

export function isPalindrome(str: string): boolean {
  const reversed = str.split('').reverse().join('');
  return reversed === str;
}

export function isPalindrome2(str: string): boolean {
  let isMatch = true;
  let reverseIndex = str.length - 1;
  for (let i: number = 0; i < str.length; i++) {
    if (str[i] !== str[reverseIndex - i]) {
      isMatch = false;
      return isMatch;
    }
  }
  return isMatch;
}

/**
 * Returns true if ANY permutation of the string is a palindrome
 * @param str
 */
export function isAnyPermutationPalindrome(str: string): boolean {
  const unmatched = new Set<string>();
  str.split('').forEach((char) => {
    if (unmatched.has(char)) unmatched.delete(char);
    else unmatched.add(char);
  });
  return unmatched.size <= 1;
}
