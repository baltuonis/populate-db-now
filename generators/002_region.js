var mysql_faker = require('../mysql-faker.js');

var count = 100;
var table = (new mysql_faker.Table('regions', count));

table.address_state('name', 1);
// Relationships
table.random_number('country_id', {
    min: 1,
    max: 5
});

module.exports.table = table;
