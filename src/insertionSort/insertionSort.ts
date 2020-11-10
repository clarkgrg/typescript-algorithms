/**
 * Sorts an array using an insertion sort
 */

 export function insertionSort(array: number[]): number[] {
  array = array.slice();
  for (let i=1; i< array.length;i++) {
    const current = array[i];
    let j = i-1;
    // Are we at the beginning or greater than current?
    while (j >= 0 && array[j] > current) {
      array[j+1] = array[j];
      j--;
    }
    array[j+1] = current;
  }
  return array;
}
