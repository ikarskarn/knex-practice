const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List service object`, function() {
    let db
    let testItems = [
        {
            id: 1,
            name: 'init Fish tricks',
            price: '13.10',
            category: 'Main',
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'init Not Dogs',
            price: '4.99',
            category: 'Snack',
            date_added: new Date('1919-12-22T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'init Bluffalo Wings',
            price: '5.50',
            category: 'Snack',
            date_added: new Date('1919-12-22T16:28:32.615Z')
        },
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())
    afterEach(() => db('shopping_list').truncate())
    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
            .into('shopping_list')
            .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            const expectedItems = testItems.map(item => ({
                ...item,
                checked: false,
            }));
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(expectedItems);
                });
        })

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        category: thirdTestItem.category,
                        checked: false,
                        date_added: thirdTestItem.date_added
                    })
                })
        })

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    // copy the test items array without the removed item
                    const expected = testItems
                    .filter(item => item.id !== itemId)
                    .map(item => ({
                        ...item,
                        checked: false,
                    }));
                    expect(allItems).to.eql(expected)
                })
        })
//
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated name',
                price: '10.07',
                checked: true,
                date_added: new Date()
            }
            const originalItem = testItems[idOfItemToUpdate - 1];
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData,
                    })
                })
        })
    })
//    
    context(`Given 'shopThis_items' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql([])
            })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name',
                price: '10.07',
                category: 'Lunch',
                checked: true,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
            }
            return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                    id: 1,
                    name: newItem.name,
                    price: newItem.price,
                    category: newItem.category,
                    checked: newItem.checked,
                    date_added: newItem.date_added,
                })
            })    
        })
    })
})