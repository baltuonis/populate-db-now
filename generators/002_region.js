var mysql_faker = require('../mysql-faker.js');

var table = (new mysql_faker.Table('regions', 2));

table.address_state('name', 1)
    // Relationships
table.random_number('country_id', {
    min: 1,
    max: 5
})

module.exports.table = table
