require('dotenv').config()

const knex = require('knex')
const knexInstance = knex({
    client: 'pg',
    connection: 'postgresql://dunder_mifflin@localhost/knex-practice',
    connection: process.env.DB_URL
})

console.log('knex and driver installed correctly');

const searchTerm = 'on'

knexInstance
  .select('name', 'price', 'date_added', 'checked', 'category')
  .from('shopping_list')
  .where('name', 'ILIKE', `%${searchTerm}%`)
  .then(result => {
    console.log("Drill 1: ", result)
})

function paginateItems(page) {
    const itemsPerPage = 6
    const offset = itemsPerPage * (page - 1)
    knexInstance
      .select('name', 'price', 'date_added', 'checked', 'category')
      .from('shopping_list')
      .limit(itemsPerPage)
      .offset(offset)
      .then(result => {
        console.log("Drill 2: ", result)
      })
  }
  
  paginateItems(2)

  function daysAgo(days) {
    knexInstance
      .select('name', 'price', 'date_added', 'checked', 'category')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
      )
      .from('shopping_list')
      .orderBy([
        { column: 'date_added', order: 'ASC' }
      ])
      .then(result => {
        console.log("Drill 3: ", result)
      })
  }
  
  daysAgo(30)

  function prices() {
    knexInstance
      .select('category', 'price')
      .from('shopping_list')
      .groupBy('category', 'price')
      .orderBy([
        { column: 'category'},
        { column: 'price', order: 'ASC' },
      ])
      .then(result => {
        console.log("Drill 4: ", result)
      })
  }
  
  prices()