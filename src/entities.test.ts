import { Entities } from './entities';

/**
 * Represents a Coin object with a date property.
 */
class Coin {
    private _date: Date;

    /**
     * Creates an instance of Coin.
     * @param date The date associated with the coin.
     */
    constructor(date: Date) {
        this._date = date;
    }

    /**
     * Gets the date associated with the coin.
     * @returns The date of the coin.
     */
    get date(): Date {
        return this._date;
    }
}

/**
 * Represents a Penny, a subtype of Coin, with an additional type property.
 */
class Penny extends Coin {
    private _type: string;

    /**
     * Creates an instance of Penny.
     * @param date The date associated with the penny.
     * @param type The type of the penny.
     */
    constructor(date: Date, type: string) {
        super(date);
        this._type = type;
    }
}

/**
 * Represents a collection of coins and pennies.
 */
class Coins extends Entities<Coin | Penny> {
}

describe('Entities', () => {
    test('should add an object', () => {
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
        cs.add(new Penny(new Date('2020-01-01'), 'wheat'));
        cs.add(new Penny(new Date('2021-01-01'), 'lincoln'));
        cs.add(new Penny(new Date('2022-01-01'), 'lincoln'));
        cs.add(new Penny(new Date('2023-01-01'), 'indian'));

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
});
