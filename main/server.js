
const express = require('express');
const cors = require('cors');


// cors config to allow requests from frontend
const allowedOrigins = [
    'http://localhost:5173',
    'https://fomonomo.xyz',
    'http://fomonomo.xyz' // we only have http for now
  ];

app.use(cors({
    origin: allowedOrigins,
    credentials: true, // if you use cookies/JWT
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));

const app = express();
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const url = process.env.mongoUri;
const client = new MongoClient(url);
client.connect();

var api = require('./api.js');
api.setApp( app, client );

const PORT = process.env.PORT || 5000;

app.listen(PORT); // start Node + Express server on port 5000
console.log('Server started on port 5000');