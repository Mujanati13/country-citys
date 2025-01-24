const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
var cors = require('cors')


app.use(cors())

// Load data from JSON file
let countryData;
try {
    const jsonPath = path.join(__dirname, './country.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    countryData = JSON.parse(rawData);
} catch (error) {
    console.error('Error loading JSON file:', error);
    process.exit(1);
}

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint to retrieve all country names
app.get('/api/countries', (req, res) => {
    try {
        const countries = Object.keys(countryData);
        res.json({
            success: true,
            data: countries,
            count: countries.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// GET endpoint to retrieve cities for a specific country
app.get('/api/cities/:country', (req, res) => {
    try {
        const country = req.params.country;
        
        // Check if country exists in our data
        if (!countryData[country]) {
            return res.status(404).json({
                success: false,
                error: 'Country not found',
                message: `No cities found for country: ${country}`
            });
        }

        // Return cities for the specified country
        res.json({
            success: true,
            country: country,
            data: countryData[country],
            count: countryData[country].length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// Start the server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});