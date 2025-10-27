
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const url = process.env.mongoUri;
const client = new MongoClient(url);
client.connect();

var api = require('./api.js');
api.setApp( app, client );

app.listen(5000); // start Node + Express server on port 5000
console.log('Server started on port 5000');