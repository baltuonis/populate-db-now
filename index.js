/**
 * Initial data generator/populator 
 */

/** jshint {inline configuration here} */

'use strict';

console.log("\n--------- POPULATE DB NOW! --------------\n")

var mysql_faker = require('./mysql-faker.js'),
    sync = require('synchronize'),
    fs = require('fs'),
    path = require('path'),
    mysql = require('mysql'),
    generators_dir = 'generators',
    generators_queue = [],
    mysql_options = {
        host: "localhost",
        user: "root",
        password: "",
        database: "test",
        multipleStatements: true,
    }

// Always executing readFile in SYNC mode
sync(fs, 'readFile')

sync.fiber(function() {

    // Include generators
    let normalizedPath = path.join(__dirname, generators_dir);

    console.log("Loading generators & sql files\n")

    fs.readdirSync(normalizedPath).forEach(function(file) {
        let filepath = './' + generators_dir + '/' + file
        let ext = path.extname(filepath)

        switch (ext) {
            case '.js':
                var generator;
                console.log("  Loading generator: " + file)
                try {
                    generator = require(filepath)
                } catch (err) {
                    console.error("  Error loading " + file + " Error " + err)
                }
                generators_queue.push(generator.table);
                break;

            case '.sql':
                var sql = new function SQL() {
                    this.file = file
                }
                console.log("  Loading SQL: " + file)
                try {
                    sql.query_string = fs.readFile(filepath, 'utf8');
                } catch (err) {
                    console.error("  Error loading " + file + " Error " + err)
                }
                generators_queue.push(sql)
                break;
        }
    });

    console.log('\nConnecting to DB & starting population\n')
    var connection = mysql.createConnection(mysql_options);
    connection.connect();
    // Disable checks so DB does not throw relationship errors
    execute_sql("SET foreign_key_checks = 0;", connection);

    generators_queue.forEach(function(gen) {
        if (gen.constructor.name == 'Table') {
            // Is generator
            truncate_table(gen.name, connection, sync.defer());
            sync.await(mysql_faker.insert([gen], mysql_options, true, connection, sync.defer()));

        } else if (gen.constructor.name == 'SQL') {
            // Is sql
            console.log("  Execute " + gen.file)
            execute_sql(gen.query_string, connection)
        }
    })

    connection.end();

    console.log("\n---- DATA POPULATION SUCCESSFUL ----\n")
})

function truncate_table(table, connection) {
    let sql = [];
    sql.push('TRUNCATE TABLE `' + table + '`');
    console.log('  Truncate ' + table)
    execute_sql(sql.join(';'), connection)
}

// Syncronized SQL
function execute_sql(sql, connection) {
    sync.await(connection.query(sql, sync.defer()))
}
