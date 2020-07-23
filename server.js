require('dotenv').config();

// Get dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const helmet = require('helmet');

// Get our API routes
const api = require('./routes/routes');

const app = express();

// put the helmet on
app.use(helmet())

// stop disclosing engine
app.disable('x-powered-by');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Point static path to angular folder
app.use(express.static(path.join(__dirname, 'angular/')));

// Set our api routes
app.use('/api', api);


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'angular/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '7777';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
  console.log(`Folio API is running on localhost:${port}`);
});
