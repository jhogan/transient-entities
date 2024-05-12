# Entities Collection Library

The Entities Collection Library is a TypeScript project that provides a generic
collection class for storing and managing items of any type. It offers
functionality for adding items to the collection, getting the count of items,
and iterating over the collection.

## Usage

### Coin(s) Example

The following example demonstrates how to use the `Entities` collection class
with the `Coin` and `Coins` classes:

```typescript
import { Entities } from './entities';

// Define a Coin class
class Coin {
    private _date: Date;

    constructor(date: Date) {
        this._date = date;
    }

    get date(): Date {
        return this._date;
    }
}

// Define a Coins class that extends Entities<Coin>
class Coins extends Entities<Coin> {}

// Create a new instance of Coins
const coinsCollection = new Coins();

// Add coins to the collection
const coin1 = new Coin(new Date('2024-01-01'));
const coin2 = new Coin(new Date('2024-02-01'));
coinsCollection.add(coin1);
coinsCollection.add(coin2);

// Get the count of coins in the collection
const count = coinsCollection.count;

// Iterate over the coins in the collection
for (const coin of coinsCollection) {
    console.log(coin.date);
}
```

## API
### `Entities<T>`

Represents a generic collection class that stores items of type T.  

#### Methods

    * `add(item: T): void:` Adds an item to the collection.
    * `count: number:` Gets the number of items in the collection.

#### Iteration
The Entities class implements the iterable protocol, allowing you to iterate
over the collection using a for...of loop.  

## License
This project is licensed under the ISC License. See the [LICENSE](LICENSE) file
for details.
