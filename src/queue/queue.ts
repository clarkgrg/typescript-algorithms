/**
 * First In First Out (FIFO)
 * with a time complextity of O(1) for key operations
 */

export class Queue<T> {
  /** Implement as map */
  private data: { [index: number]: T } = Object.create(null);
  private lastDequeuedIndex = 0;
  private nextEnqueueIndex = 0;

  /** Enqueses the item in O(1) */
  enqueue(item: T): void {
    this.data[this.nextEnqueueIndex] = item;
    this.nextEnqueueIndex++;
  }

  /**
   * Dequeues the first inserted item in O(1)
   * If there are no more items it returned 'undefined'
   */
  dequeue(): T | undefined {
    if (this.lastDequeuedIndex !== this.nextEnqueueIndex) {
      const dequeued = this.data[this.lastDequeuedIndex];
      delete this.data[this.lastDequeuedIndex];
      this.lastDequeuedIndex++;
      return dequeued;
    }
  }

  /**
   * Returns the number of elements in the queue
   */
  size(): number {
    return this.nextEnqueueIndex - this.lastDequeuedIndex;
  }
}
