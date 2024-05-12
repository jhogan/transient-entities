import { Entities } from './entities';

class Coin{
    private _date:Date;

    constructor(date:Date){
        this._date = date;
    }

    get date(): Date{
        return this._date;
    }
}

class Penny extends Coin{ 
    private _type:string
    constructor(date:Date, type:string){
        super(date)
        this._type = type
    }
}


class Coins extends Entities<Coin | Penny>{
}

describe('Entities', () => {
    test('should add an object', () => {
        const cs = new Coins()
        const c = new Coin(new Date('2024-01-01'))
        cs.add(c)
        expect(cs.count).toBe(1)
    });

    test('should iterate', () => {
        const cs = new Coins()
        cs.add(new Coin(new Date('2020-01-01')))
        cs.add(new Coin(new Date('2021-01-01')))
        cs.add(new Coin(new Date('2022-01-01')))
        cs.add(new Coin(new Date('2023-01-01')))
        let i = 0
        for(const c of cs){
            let expected = c.date
            let actual = new Date(`202${i}-01-01`)
            expect(expected).toEqual(actual)
            i++
        }
    });

    test('should allow extended entity objects', () => {
        const cs = new Coins()
        cs.add(new Penny(new Date('2020-01-01'), 'wheat'))
        cs.add(new Penny(new Date('2021-01-01'), 'lincoln'))
        cs.add(new Penny(new Date('2022-01-01'), 'lincoln'))
        cs.add(new Penny(new Date('2023-01-01'), 'indian'))
        expect(cs.count).toBe(4)
    });
});

