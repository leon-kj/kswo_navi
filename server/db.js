const { Pool } = require('pg'); // Import the 'pg' module
const fs = require('fs'); // Import the 'fs' module for reading files

// Read the password from the file
const password = fs.readFileSync('./password.txt', 'utf8');


const pool = new Pool({
    user: 'postgres',            
    host: 'localhost',           
    database: 'kswo_navi_rooms',     
    password: password,   
    port: 5432,                  // Default PostgreSQL port
});

module.exports = pool; // Export the connection pool
