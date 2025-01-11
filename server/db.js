const { Pool } = require('pg'); // Import the 'pg' module

const pool = new Pool({
    user: 'postgres',            
    host: 'localhost',           
    database: 'kswo_navi_rooms',     
    password: 'leonleon',   
    port: 5432,                  // Default PostgreSQL port
});

module.exports = pool; // Export the connection pool
