module.exports = class LogSourceHeap {
    constructor() {
        this.heap = [];
    }

    insert(logEntry) {
        this.heap.push(logEntry);
        this.bubbleUp();
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown();
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp() {
        let index = this.heap.length - 1;

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);

            if (this.heap[index].logEntry.date >= this.heap[parentIndex].logEntry.date) break;

            // Swap log entries
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];

            index = parentIndex;
        }
    }

    bubbleDown() {
        let index = 0;
        const length = this.heap.length;

        while(index < length) {
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            let smallestIndex = index;

            if (leftIndex < length && this.heap[leftIndex].logEntry.date < this.heap[smallestIndex].logEntry.date) {
                smallestIndex = leftIndex;
            }

            if (rightIndex < length && this.heap[rightIndex].logEntry.date < this.heap[smallestIndex].logEntry.date) {
                smallestIndex = rightIndex;
            }

            if (smallestIndex === index) break;

            // Swap log entries
            [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
            index = smallestIndex;
        }
    }
}