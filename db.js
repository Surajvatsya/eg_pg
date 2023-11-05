const { Pool } = require('pg');

const pool = new Pool({
  user: 'suraj.kumar1',
  host: 'localhost',
  database: 'eg_pg',
  password: 'abcd',
  port: '5432',
});

module.exports = pool;
