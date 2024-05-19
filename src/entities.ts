/**
 * Represents a generic collection class that stores items of type T.
 */
export class Entities<T> {
    /** The array to store items of type T. */
    protected _items: T[] = [];

    public constructor(){
    }

    /**
     * Adds an item to the collection.
     * 
     * This method can accept either an item of type T or another
     * instance of Entities containing items of type T.  If the item is
     * an instance of Entities, it will recursively add all items from
     * that instance to the current collection.
     *
     * @param item The item to add to the collection. Can be of type T
     *             or another instance of Entities<T>.
     * 
     * Examples:
     * ```
     * const collection = new Entities<SomeTypeT>();
     * const item = new SomeTypeT('example');
     *
     * // Adds a single item of type SomeTypeT
     * collection.add(item); 
     * 
     * const subCollection = new Entities<SomeTypeT>();
     * subCollection.add(new SomeTypeT('another example'));
     * 
     * // Adds all items from subCollection to collection
     * collection.add(subCollection); 
     * ```
     */
    public add(item: T | Entities<T>): void {
        if (item instanceof Entities){
            for (const item1 of item){
                this.add(item1);
            }
        }else{
            this._items.push(item);
        }
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
     * The attributes can be followed by an optional order (asc or desc).
     * If no order is specified, the default is ascending (asc).
     *
     * @param ...attrs The attributes to sort by. Each attribute can 
     *                 be followed by an optional order (Order.Asc or 
     *                 Order.Desc).
     * 
     * @example
     * // Sort by 'age' in ascending order (default order)
     * entities.sort('age');
     *
     * @example
     * // Sort by 'age' in descending order
     * entities.sort('age', Order.Desc);
     * 
     * @example
     * // Sort by 'age' in ascending order then my 'name' in ascending
     * order
     * entities.sort('age', 'name')
     * 
     * @example
     * // Sort by 'name' in ascending order, then by 'age' in 
     * // descending order
     * entities.sort('name', Order.Asc, 'age', Order.Desc);
     */
    public sort(...attrs: (string | Order)[]): void {
        this._items.sort((a: T, b: T) => {
            for (let i = 0; i < attrs.length; i++){
                const attr = attrs[i] as string;
                let ord = attrs[i + 1] as Order;

                if (ord === Order.Asc || ord === Order.Desc){
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

    /**
     * Returns a new sorted instance of the collection based on the
     * specified attributes.
     * 
     * This method creates a clone of the current collection, sorts the
     * cloned collection, and then returns the sorted clone. The sorting
     * logic and more details can be found in the `sort` method.
     * 
     * @param ...attrs The attributes to sort by. Each attribute can 
     *                 be followed by an optional order (Order.Asc or 
     *                 Order.Desc).
     * 
     * @example
     * // Create a sorted copy of the collection by 'age' in ascending
     * order (default order)
     * const sortedCollection = entities.sorted('age');
     * 
     * @example
     * // Create a sorted copy of the collection by 'age' in descending
     * order
     * const sortedCollection = entities.sorted('age', Order.Desc);
     * 
     * @example
     * // Create a sorted copy of the collection by 'age' in ascending
     * order then by 'name' in ascending order
     * const sortedCollection = entities.sorted('age', 'name');
     * 
     * @example
     * // Create a sorted copy of the collection by 'name' in ascending
     * order, then by 'age' in descending order
     * const sortedCollection = entities.sorted('name', Order.Asc, 'age', Order.Desc);
     */
    public sorted(...attrs: (string | Order)[]): Entities<T>{
        // Clone
        const ctor = this.constructor as { new(): Entities<T> };
        const r = new ctor();

        r.add(this);

        r.sort(...attrs);
        return r;
    }
}

export enum Order{
    Asc, 
    Desc
}   
