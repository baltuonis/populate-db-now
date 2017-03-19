# Populate db NOW!

Quick & dirty Node.js script that can fill your DB with generated data or SQL.

Credits for https://github.com/michaelmior/mysql-faker whose library I hacked & included into my project.

## Features

* Consumes JS generators (using faker.js & mysql-faker.js)
* Consumes SQL too!
* Works in synchornized manner, consumes generators/sql in sorted sequence: `000_*.sql, 001_*.sql, 002_*.js 003_*.sql` (slower, but I needed this for mainting ForeignKeys)
* Is pretty fast
* Has progress bars!

## Quick start

### Set your DB params

`index.js`

```
   mysql_options = {
        host: "localhost",
        user: "root",
        password: "password",
        database: "db_name",
```

### Write JS generator

To `generators/000_region.js`

Will create table and populate with fake data

** WARNING ** - before executing JS generator script will TRUNCATE table

```
var mysql_faker = require('../mysql-faker.js');

var table = (new mysql_faker.Table('regions', 2));

table.address_state('name', 1)
    // Relationships
table.random_number('country_id', {
    min: 1,
    max: 5
})

module.exports.table = table
```

### Write SQL

To `generators/001_set_db_utf8.sql`

```
ALTER DATABASE xxxxxxxx CHARACTER SET utf8 COLLATE utf8_unicode_ci;
-- Some more crazy stuff
```


 
## Generating data

I am using faker.js and hacked mysql-faker.js (which is included in project)

More info about field arguments https://github.com/Marak/faker.js/wiki/Text
 
### Faker types

var fakerTypes = {
  'name': [
    'firstName',
    'lastName',
    'findName',
    'prefix',
    'suffix'
  ],

  'address': [
    'zipCode',
    'city',3323
    'stateAbbr',
    'latitude',
    'longitude'
  ],

  'phone': [
    'phoneNumber',
    'phoneNumberFormat',
    'phoneFormats'
  ],
  
  'internet': [
    'avatar',
    'email',
    'userName',
    'domainName',
    'domainSuffix',
    'domainWord',
    'ip',
    'userAgent',
    'color',
    'password'
  ],
  
  'company': [
    'suffixes',
    'companyName',
    'companySuffix',
    'catchPhrase',
    'bs',
    'catchPhraseAdjective',
    'catchPhraseDescriptor',
    'catchPhraseNoun',
    'bsAdjective',
    'bsBuzz',
    'bsNoun'
  ],

  'image': [
    'image',
    'avatar',
    'imageUrl',
    'abstract',
    'animals',
    'business',
    'cats',
    'city',
    'food',
    'nightlife',
    'fashion',
    'people',
    'nature',
    'sports',
    'technics',
    'transport'
  ],

  'lorem': [
    {'words': function(words) { return words.join(' '); }},
    'sentence',
    'sentences',
    'paragraph',
    'paragraphs'
  ],

  'helpers': [
    'randomNumber',
    'randomize',
    'slugify',
    'replaceSymbolWithNumber',
    'shuffle',
    'mustache',
    'createCard',
    'contextualCard',
    'userCard',
    'createTransaction'
  ],

  'date': [
    'past',
    'future',
    'between',
    'recent'
  ],

  'random': [
    'number',
    'array_element',
    'object_element',
    'uuid'
  ],

  'finance': [
    'account',
    'accountName',
    'mask',
    'amount',
    'transactionType',
    'currencyCode',
    'currencyName',
    'currencySymbol'
  ],

  'hacker': [
    'abbreviation',
    'adjective',
    'noun',
    'verb',
    'ingverb',
    'phrase'
  ]
}