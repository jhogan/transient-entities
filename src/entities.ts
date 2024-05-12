/**
 * Represents a generic collection class that stores items of type T.
 */
export class Entities<T> {
    /** The array to store items of type T. */
    protected _items: T[] = [];

    /**
     * Adds an item to the collection.
     * @param item The item to add to the collection.
     */
    add(item: T): void {
        this._items.push(item);
    }

    /** 
     * Gets the number of items in the collection.
     * @returns The number of items in the collection.
     */
    get count(): number {
        return this._items.length;
    }

    /**
     * Returns iterator object that iterates over collection.  
     * @returns An iterator object for iterating over the
     * items in the collection.
     */
    [Symbol.iterator](): Iterator<T> {
        let ix = 0;
        let items = this._items;

        return {
            /**
             * Advances iterator; returns the next item.
             * @returns An IteratorResult containing the next item.
             */
            next(): IteratorResult<T> {
                if (ix < items.length) {
                    return {
                        done: false,
                        // Return the next item and advance the index
                        value: items[ix++] 
                    };
                } else {
                    return {
                        done: true,
                        // Signal that the iterator has reached the end
                        value: null as any 
                    };
                }
            }
        };
    }

    // Implement the indexer
    public get(ix: number): T {
        return this._items[ix];
    }

    public set(ix: number, value: T): void {
       this._items[ix] = value;
    }

    public head(n: number = 10): Entities<T> {
        if (n < 0){
            throw new RangeError('n must be 0 or greater');
        }
        if (n > this.count){
            throw new RangeError(
                "Requested number of objects exceeds " +
                "the length of the collection."
            );
        }

        const r: Entities<T> = new Entities();

        for(let i: number = 0; i < n; i++){
            r.add(this.get(i));
        }

        return r;
    }
}
