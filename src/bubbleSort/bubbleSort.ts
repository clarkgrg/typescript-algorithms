/**
 * Idiomatic bubble sort implementation
 */

export function bubbleSort(array: number[]): number[] {
  // Make copy of the array
  array = array.slice();
  while (true) {
    let swapped = false;
    for (let j = 0; j < array.length - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
      }
    }
    // array is already sorted - stop
    if (!swapped) break;
  }

  return array;
}
