const express = require('express');
const app = express();
const pool = require('./db');
const router = express.Router();


// Routes
router.get('/api/rooms', async (req, res) => { // Get all rooms
    try {
        const result = await pool.query('SELECT id, name, floor, ST_AsGeoJSON(geom) AS geom, metadata, type, teacher FROM rooms');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/api/rooms/search/:query', async (req, res) => { // Search proposals
    try {
        const { query } = req.params;
        const result = await pool.query(`
          SELECT id, name, type
          FROM rooms 
          WHERE name LIKE $1 OR UPPER(type) LIKE $1
          ORDER BY name`,
           [`%${query.toUpperCase()}%`]
          );
        res.json(result.rows);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});  
router.get('/api/rooms/:id', async (req, res) => { // Get room by id
    try {
        const { id } = req.params;
        const result = await pool.query(`
          SELECT id, name, floor, ST_AsGeoJSON(geom) AS geom, metadata, type, teacher 
          FROM rooms 
          WHERE id = $1`, [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/api/rooms/:name', async (req, res) => { // Get room by name or type
    try {
        const { name } = req.params;
        const result = await pool.query(`
          SELECT id, name, floor, ST_AsGeoJSON(geom) AS geom, metadata, type, teacher 
          FROM rooms 
          WHERE name LIKE $1 OR UPPER(type) LIKE $1`,
           [`%${name.toUpperCase()}%`]
          );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/api/rooms/floor/:floor', async (req, res) => { // Get rooms by floor
    try {
        const { floor } = req.params;
        const result = await pool.query(`
          SELECT id, name, floor, ST_AsGeoJSON(geom) AS geom, metadata, type, teacher 
          FROM rooms 
          WHERE floor = $1;`, 
          [floor]);

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/api/nearest-room', async (req, res) => {
  try {
    const { floor, lon, lat } = req.query;
    const result = await pool.query(
      `SELECT id, name, floor, ST_AsGeoJSON(geom) AS geom, metadata, type, teacher
       FROM rooms
       WHERE floor = $1
       AND ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, 10)
       ORDER BY geom <-> ST_SetSRID(ST_MakePoint($2, $3), 4326)
       LIMIT 1;`,
      [floor, lon, lat]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'No room found within 10 meters.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error.' });
  }
});

module.exports = router; // Export the routes
