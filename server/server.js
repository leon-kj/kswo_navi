const express = require('express');
const cors = require('cors'); // For handling requests from the frontend
const routes = require('./routes');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(routes); // Add routes from routes.js 

// Start the server
const PORT = 8174; 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
