import { Order, Entities } from './entities';

/**
 * Represents a Coin object with a date property.
 */
class Coin {
    private _date: Date;
    private _type: string | null;
    private _weight: number | null;

    /**
     * Creates an instance of Coin.
     * @param date The date associated with the coin.
     */
    constructor(
        date: Date, 
        type: string | null = null,
        weight: number | null = null,
    ) {
        this._date = date;
        this._type = type;
        this._weight = weight;
    }

    /**
     * Gets the date associated with the coin.
     * @returns The date of the coin.
     */
    get date(): Date {
        return this._date;
    }

    get type(): string | null{
        return this._type;
    }

    set type(value: string){
        this._type = value;
    }

    get weight(): number | null{
        return this._weight;
    }  
}

/**
 * Represents a Penny, a subtype of Coin, with an additional type property.
 */
class Penny extends Coin {
}

/**
 * Represents a collection of coins and pennies.
 */
class Coins extends Entities<Coin | Penny> {
}

describe('Entities', () => {
    test('it adds an object', () => {
        // Arrange
        const cs = new Coins();
        const c = new Coin(new Date('2024-01-01'));

        // Act
        cs.add(c);

        // Assert
        expect(cs.count).toBe(1);
    });

    test('should iterate', () => {
        // Arrange
        const cs = new Coins();
        cs.add(new Coin(new Date('2020-01-01')));
        cs.add(new Coin(new Date('2021-01-01')));
        cs.add(new Coin(new Date('2022-01-01')));
        cs.add(new Coin(new Date('2023-01-01')));
        let i = 0;

        // Act & Assert
        for (const c of cs) {
            let expected = c.date;
            let actual = new Date(`202${i}-01-01`);
            expect(expected).toEqual(actual);
            i++;
        }
    });

    test('should allow extended entity objects', () => {
        // Arrange
        const cs: Coins = new Coins();
        cs.add(new Penny(new Date('2020-01-01')));
        cs.add(new Penny(new Date('2021-01-01')));
        cs.add(new Penny(new Date('2022-01-01')));
        cs.add(new Penny(new Date('2023-01-01')));

        // Act & Assert
        expect(cs.count).toBe(4);
    });

    test('It calls head with default argument', () => {
        // Arrange
        const cs = new Coins();
        for (let i: number = 2000; i < 2100; i++){
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act 
        let head: Coins = cs.head();

        // Assert
        expect(head.count).toBe(10)

        for (let i: number = 2000; i < 2010; i++){
            let expected: Date = head.get(i - 2000).date;
            expect(expected).toEqual(new Date(`${i}-01-01`));
        }
    });

    test('It calls head with non-default argument', () => {
        // Arrange
        const cs = new Coins();
        for (let i = 2000; i < 2100; i++){
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act and Assert
        expect(cs.head(0).count).toBe(0)
        expect(cs.head(20).count).toBe(20)

        // Act
        const head: Coins = cs.head(20)

        // Assert
        for (let i = 2000; i < 2020; i++){
            let expected: Date = head.get(i - 2000).date;
            expect(expected).toEqual(new Date(`${i}-01-01`));
        }
    });

    test('Head throws RangeError when argument is out of range', () => {
        // Arrange
        const cs = new Coins();

        // Act and Assert
        expect(() => cs.head(1)).toThrow(RangeError);

        // Arrange
        for (let i = 2000; i < 2010; i++){
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act & Assert
        expect(() => cs.head(cs.count + 1)).toThrow(RangeError);

        expect(() => cs.head(-1)).toThrow(RangeError);
    })

    test('It calls tail with default argument', () => {
        // Arrange
        const cs = new Coins();
        for (let i = 2000; i < 2100; i++) {
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act
        let tail: Coins = cs.tail();

        // Assert
        expect(tail.count).toBe(10);

        for (let i = 2090; i < 2100; i++) {
            let expected = tail.get(i - 2090).date;
            expect(expected).toEqual(new Date(`${i}-01-01`));
        }
    });

    test('It calls tail with non-default argument', () => {
        // Arrange
        const cs = new Coins();
        for (let i = 2000; i < 2100; i++) {
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }
        const tail: Coins = cs.tail(20);

        // Act & Assert
        expect(cs.tail(0).count).toBe(0);
        expect(tail.count).toBe(20);

        for (let i = 2080; i < 2100; i++) {
            let expected = tail.get(i - 2080).date;
            expect(expected).toEqual(new Date(`${i}-01-01`));
        }
    });

    test('Tail throws RangeError when argument is out of range', () => {
        // Arrange
        const cs = new Coins();

        // Act & Assert
        expect(() => cs.tail(1)).toThrow(RangeError);

        // Arrange
        for (let i = 2000; i < 2010; i++) {
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act & Assert
        expect(() => cs.tail(cs.count + 1)).toThrow(RangeError);
        expect(() => cs.tail(-1)).toThrow(RangeError);
    });

    test('It enumerates', () => {
        // Arrange
        const cs = new Coins();

        // Arrange
        for (let i = 2000; i < 2010; i++) {
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act & Assert
        let i = 0;
        for (const [ix, c] of cs.enumerate()){
            expect(cs.get(ix)).toBe(c);
            expect(i).toBe(i++);
		}
    });

    test('enumerate should work with empty collection', () => {
        // Arrange
        const entities = new Entities<Coin>();

        // Act
        const result = entities.enumerate();

        // Assert
        expect([...result]).toEqual([]);
    });

    test('enumerate returns correct type', () => {
        // Arrange
        const cs = new Entities<Coin>();

        // Act
        const result: Iterable<[number, Coin]> = cs.enumerate();
    });

    test('it call get', () => {
        // Arrange
        const cs = new Coins();
        for (let i = 2000; i < 2100; i++) {
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act and Assert
        for (const [i, c] of cs.enumerate()){
            expect(cs.get(i)).toEqual(c);
        }
        
    });

    test('it calls set', () => {
        // Arrange
        const cs = new Coins();
        for (let i = 2000; i < 2001; i++) {
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act
        cs.set(1, new Coin(new Date('3000-01-01')));

        // Assert

        expect(cs.get(0).date).toEqual(new Date('2000-01-01'));
        expect(cs.get(1).date).toEqual(new Date('3000-01-01'));

    });

    test('it calls sort with one key', () => {
        // Arrange
        const cs = new Coins();
        for (let i = 2003; i >= 2000; i--) {
            cs.add(new Coin(new Date(`${i}-01-01`)));
        }

        // Act
        cs.sort('date');

        expect(cs.get(0).date).toEqual(new Date('2000-01-01'));
        expect(cs.get(1).date).toEqual(new Date('2001-01-01'));
        expect(cs.get(2).date).toEqual(new Date('2002-01-01'));
        expect(cs.get(3).date).toEqual(new Date('2003-01-01'));
    });

    test('it calls sort with two keys', () => {
        // Arrange
        const cs = new Coins();
        cs.add(new Penny(new Date(`2000-01-01`), 'wheat'));
        cs.add(new Penny(new Date(`2000-01-01`), 'bicentennial'));
        cs.add(new Penny(new Date(`2000-01-01`), 'steal'));

        cs.add(new Penny(new Date(`2001-01-01`), 'wheat'));
        cs.add(new Penny(new Date(`2001-01-01`), 'bicentennial'));
        cs.add(new Penny(new Date(`2001-01-01`), 'steal'));

        const sorted = [
            [new Date('2000-01-01'), 'bicentennial'],
            [new Date('2000-01-01'), 'steal'],
            [new Date('2000-01-01'), 'wheat'],

            [new Date('2001-01-01'), 'bicentennial'],
            [new Date('2001-01-01'), 'steal'],
            [new Date('2001-01-01'), 'wheat'],
        ];

        // Act
        cs.sort('date', 'type');

        for (const [i, p] of cs.enumerate()){
            expect(p.date).toEqual(sorted[i][0]);
            expect(p.type).toEqual(sorted[i][1]);
            
        }
    });

    test('it sort by asc then by desc', () => {
        // Arrange
        const cs = new Coins();
        cs.add(new  Penny(new  Date(`2000-01-01`),  'wheat'));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'bicentennial'));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'steal'));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'wheat'));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'bicentennial'));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'steal'));

        const sorted = [
            [new Date('2000-01-01'), 'wheat'],
            [new Date('2000-01-01'), 'steal'],
            [new Date('2000-01-01'), 'bicentennial'],

            [new Date('2001-01-01'), 'wheat'],
            [new Date('2001-01-01'), 'steal'],
            [new Date('2001-01-01'), 'bicentennial'],
        ];

        // Act
        cs.sort('date', Order.Asc, 'type', Order.Desc);

        for (const [i, p] of cs.enumerate()){
            expect(p.date).toEqual(sorted[i][0]);
            expect(p.type).toEqual(sorted[i][1]);
        }
    });

    test('it sort by asc, desc then by asc', () => {
        // Arrange
        const cs = new Coins();
        cs.add(new  Penny(new  Date(`2001-01-01`),  'steal',         2));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'steal',         9));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'bicentennial',  1));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'steal',         4));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'wheat',         1));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'steal',         3));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'wheat',         1));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'steal',         5));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'steal',         3));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'bicentennial',  1));

        const sorted = [
            [new  Date('2000-01-01'),  'wheat',         1],
            [new  Date('2000-01-01'),  'steal',         3],
            [new  Date('2000-01-01'),  'steal',         4],
            [new  Date('2000-01-01'),  'steal',         5],
            [new  Date('2000-01-01'),  'bicentennial',  1],
            [new  Date('2001-01-01'),  'wheat',         1],
            [new  Date('2001-01-01'),  'steal',         2],
            [new  Date('2001-01-01'),  'steal',         3],
            [new  Date('2001-01-01'),  'steal',         9],
            [new  Date('2001-01-01'),  'bicentennial',  1],
        ];

        // Act
        cs.sort('date', Order.Asc, 'type', Order.Desc, 'weight');

        // Assert
        for (const [i, p] of cs.enumerate()){
            expect(p.date).toEqual(sorted[i][0]);
            expect(p.type).toEqual(sorted[i][1]);
            expect(p.weight).toEqual(sorted[i][2]);
        }

        // Act
        cs.sort(
            'date', Order.Asc, 'type', Order.Desc, 'weight', Order.Asc
        );

        // Assert
        for (const [i, p] of cs.enumerate()){
            expect(p.date).toEqual(sorted[i][0]);
            expect(p.type).toEqual(sorted[i][1]);
            expect(p.weight).toEqual(sorted[i][2]);
        }
    });

    test('it sort by desc, asc then by desc', () => {
        // Arrange
        const cs = new Coins();
        cs.add(new  Penny(new  Date(`2001-01-01`),  'steal',         2));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'steal',         9));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'bicentennial',  1));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'steal',         4));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'wheat',         1));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'steal',         3));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'wheat',         1));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'steal',         5));
        cs.add(new  Penny(new  Date(`2001-01-01`),  'steal',         3));
        cs.add(new  Penny(new  Date(`2000-01-01`),  'bicentennial',  1));

        const sorted = [
            [new  Date('2001-01-01'),  'bicentennial',  1],
            [new  Date('2001-01-01'),  'steal',         9],
            [new  Date('2001-01-01'),  'steal',         3],
            [new  Date('2001-01-01'),  'steal',         2],
            [new  Date('2001-01-01'),  'wheat',         1],

            [new  Date('2000-01-01'),  'bicentennial',  1],
            [new  Date('2000-01-01'),  'steal',         5],
            [new  Date('2000-01-01'),  'steal',         4],
            [new  Date('2000-01-01'),  'steal',         3],
            [new  Date('2000-01-01'),  'wheat',         1],
        ];

        // Act
        cs.sort(
            'date', Order.Desc, 'type', Order.Asc, 'weight', Order.Desc
        );

        // Assert
        for (const [i, p] of cs.enumerate()){
            expect(p.date).toEqual(sorted[i][0]);
            expect(p.type).toEqual(sorted[i][1]);
            expect(p.weight).toEqual(sorted[i][2]);
        }
    });
});
