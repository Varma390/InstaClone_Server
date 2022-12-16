const express = require("express");
const app = express()
// Parse JSON bodies (as sent by API clients)
//  We are using express.json() middleware to handle JSON data.
app.use(express.json());

//Import all routes present in routes folder
const Route = require('./routes/postDataRoute')
app.use('/', Route)


module.exports = app;

