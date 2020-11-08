export type CompareFn<T> = (a: T, b: T) => number;

export class Heap<T> {
  private data: T[] = [];
  constructor(private compareFn: CompareFn<T>) {}

  private left(nodeIndex: number): number {
    return 2 * nodeIndex + 1;
  }

  private right(nodeIndex: number): number {
    return 2 * nodeIndex + 2;
  }

  private parent(nodeIndex: number): number {
    return nodeIndex % 2 == 0 ? (nodeIndex - 2) / 2 : (nodeIndex - 1) / 2;
  }

  /**
   * Adds the given element into the heap in O(logn)
   */
  add(element: T) {
    this.data.push(element);
    this.siftUp(this.data.length - 1);
  }

  /**
   * Moves the node at given index up to its proper place in the heap
   * @param index The index of the node to move up
   */
  private siftUp(index: number): void {
    let parent = this.parent(index);
    while (
      index > 0 &&
      this.compareFn(this.data[parent], this.data[index]) > 0
    ) {
      [this.data[parent], this.data[index]] = [
        this.data[index],
        this.data[parent],
      ];
      index = parent;
      parent = this.parent(index);
    }
  }

  /**
   * Retrieves and removes the root element of this heap in O(logn)
   * - Returns undefined if the heap is empty
   */
  extractRoot(): T | undefined {
    if (this.data.length > 0) {
      const root = this.data[0];
      const last = this.data.pop();
      if (this.data.length > 0) {
        // @ts-ignore
        this.data[0] = last;
        this.siftDown(0);
      }
      return root;
    } else {
      return undefined;
    }
  }

  /**
   * Moves the node at the given index down to its proper place in the heap
   * @param nodeIndex the index of the node to move down
   */
  private siftDown(nodeIndex: number): void {
    /** @returns the index containing the smaller value */
    const minIndex = (left: number, right: number) => {
      if (right >= this.data.length) {
        if (left >= this.data.length) {
          return -1;
        } else {
          return left;
        }
      } else {
        if (this.compareFn(this.data[left], this.data[right]) <= 0) {
          return left;
        } else {
          return right;
        }
      }
    };

    let min = minIndex(this.left(nodeIndex), this.right(nodeIndex));

    while (min >= 0 && this.compareFn(this.data[nodeIndex], this.data[min])) {
      [this.data[min], this.data[nodeIndex]] = [
        this.data[nodeIndex],
        this.data[min],
      ];
      nodeIndex = min;
      min = minIndex(this.left(nodeIndex), this.right(nodeIndex));
    }
  }

  /**
   * Returns the number of elements in the heap
   */
  size() {
    return this.data.length;
  }

  /**
   * Retrieves but does not remove the root element of the heap in O(1)
   * - Returns undefined if heap is empty
   */
  peek(): T | undefined {
    if (this.data.length > 0) {
      return this.data[0];
    } else {
      return undefined;
    }
  }
}

const heap = new Heap<number>((a, b) => a - b);
heap.add(1);
heap.add(3);
heap.add(2);
//console.log(heap.size());

console.log(heap.extractRoot());
console.log(heap.extractRoot());
console.log(heap.extractRoot());
