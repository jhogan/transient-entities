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

    *[Symbol.iterator](): IterableIterator<T> {
        for (const item of this._items) {
            yield item;
        }
    }

    }

    // Implement the indexer
    public get(ix: number): T {
        return this._items[ix];
    }

    public set(ix: number, value: T): void {
       this._items[ix] = value;
    }

    public tail(n: number = 10): Entities<T> {
        return this.get_extremities(n, false);
    }

    public head(n: number = 10): Entities<T> {
        return this.get_extremities(n, true);
    }

    private get_extremities(n: number, head: boolean): Entities<T> {
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

        let stop: number = head ? n: this.count;
        
        for(let i = head ? 0 : this.count - n; i < stop; i++){
            r.add(this.get(i));
        }

        return r;
    }
}
