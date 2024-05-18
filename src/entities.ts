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
    public add(item: T): void {
        this._items.push(item);
    }

    /** 
     * Gets the number of items in the collection.
     * @returns The number of items in the collection.
     */
    public get count(): number {
        return this._items.length;
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        for (const item of this._items) {
            yield item;
        }
    }

    /**
    * Provides an enumerated iterator for the collection.
    * This yields both the index and the item at that index.
    * @yields A tuple containing the index and the item.
    */
    public *enumerate(): Iterable<[number, T]> {
        let index = 0;
        for (const item of this) {
            yield [index++, item];
        }
    }

    /**
    * Returns the last `n` items in the collection.
    * @param n The number of items to retrieve from the end. Defaults
    * to 10.
    * @returns A new Entities instance containing the last `n` items.
    * @throws RangeError if `n` is negative or exceeds the number of
    * items in the collection.
    */
    public tail(n: number = 10): Entities<T> {
        return this.get_extremities(n, false);
    }

    /**
    * Returns the first `n` items in the collection.
    * @param n The number of items to retrieve from the beginning.
    * Defaults to 10.
    * @returns A new Entities instance containing the first `n` items.
    * @throws RangeError if `n` is negative or exceeds the number of
    * items in the collection.
    */
    public head(n: number = 10): Entities<T> {
        return this.get_extremities(n, true);
    }

    /**
    * Returns the first or last `n` items in the collection based on
    * the `head` parameter.
    * @param n The number of items to retrieve.
    * @param head If true, retrieves the first `n` items; otherwise,
    * retrieves the last `n` items.
    * @returns A new Entities instance containing the specified items.
    * @throws RangeError if `n` is negative or exceeds the number of
    * items in the collection.
    */
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

        let stop: number = head ? n : this.count;

        for(let i = head ? 0 : this.count - n; i < stop; i++){
            r.add(this.get(i));
        }

        return r;
    }
    /**
     * Implements an indexer to get an item at a specific index.
     * @param ix The index of the item to retrieve.
     * @returns The item at the specified index.
     */
    public get(ix: number): T {
        return this._items[ix];
    }

    /**
     * Implements an indexer to set an item at a specific index.
     * @param ix The index where the item should be set.
     * @param value The item to set at the specified index.
     */
    public set(ix: number, value: T): void {
       this._items[ix] = value;
    }

    /**
     * Sorts the collection based on the specified attributes.
     * @param attrs The attributes to sort by. Multiple attributes can
     * be specified.
     */
    public sort(...attrs: (string | Order)[]): void {
        this._items.sort((a: T, b: T) => {
            for (let i = 0; i <= attrs.length; i++){
                const attr = attrs[i] as string;
                let ord = attrs[i + 1] as Order;

                if (ord == Order.Asc || ord == Order.Desc){
                    i++;
                }else{
                    ord = Order.Asc;
                }

                // Using 'as any' to access the attribute dynamically
                const aval: any = (a as any)[attr];
                const bval: any = (b as any)[attr];

                if (aval < bval) {
                    return ord == Order.Asc ? -1 : 1;
                } else if (aval > bval) {
                    return ord == Order.Asc ? 1 : -1;
                }
            }
            return 0;
        });
    }
}

export enum Order{
    Asc, 
    Desc
}   
