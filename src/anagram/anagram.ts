/* A word is an anagram of another if you can arrange its characters to producer the second word
 */

export function areAnagrams(s1: string, s2: string): boolean {
  const charCount = new Map<String, number>();
  for (const char of s1.split('')) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }
  for (const char of s2.split('')) {
    if (!charCount.has(char)) return false;
    charCount.set(char, <number>charCount.get(char) - 1);
  }
  return Array.from(charCount.values()).every((val) => val === 0);
}
