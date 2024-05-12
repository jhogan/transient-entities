export class Entities<T> {
    protected _items: T[] = [];

    add(item: T): void {
        this._items.push(item);
    }

    get count(): number{
        return this._items.length;
    }

    [Symbol.iterator](): Iterator<T> {
        let ix = 0;
        let items = this._items;

        return {
            next(): IteratorResult<T> {
                if (ix < items.length) {
                    return {
                        done: false,
                        value: items[ix++]
                    };
                } else {
                    return {
                        done: true,
                        value: null as any // TypeScript enforces strict null checks
                    };
                }
            }
        };
    }
}

