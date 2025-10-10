const { MongoClient } = require('mongodb');
const fs = require('fs');

async function getMongoUri() {
        try {
            const response = await fetch('secret_creds.json'); // Replace with your file path
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json(); // Parse the JSON data
            return jsonData['mongoUri']; // Access the mongoUri property    
        } catch (error) {
            console.error("Error fetching or parsing JSON:", error);
        }
    }


async function connectToMongoDB() {
    const uri = await getMongoUri(); // Replace with your connection string and database name
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected successfully to MongoDB!");
        const db = client.db('ucf_rsos'); // Access your database
        const collection = db.collection('events'); // Access your collection

        // Read and parse CSV into rows, returning a Promise so we can await it
        const { parse } = require('csv-parse');
        const filePath = 'rso_events.csv'; // Replace with your CSV file path

        function parseCsvFile(path) {
            return new Promise((resolve, reject) => {
                const rows = [];
                fs.createReadStream(path)
                    .pipe(parse({ columns: true, skip_empty_lines: true }))
                    .on('data', (row) => rows.push(row))
                    .on('end', () => resolve(rows))
                    .on('error', (err) => reject(err));
            });
        }

        let rows = [];
        try {
            rows = await parseCsvFile(filePath);
            console.log(`CSV file processed. ${rows.length} rows parsed.`);
        } catch (err) {
            console.error('Error reading or parsing CSV:', err);
            return; // stop if we can't read the CSV
        }

        console.log("Adding to Database");
        // Option A: insert sequentially and await each insert (easier to see errors)
        for (const row of rows) {
            try {
                const objectToInsert = {
                    organizationName: row['organizationName'] || null,
                    organizationNames: (row['organizationNames'] || '').replaceAll("'", '').replace('[', '').replace(']', '').split(',').map(s => s.trim()).filter(Boolean),
                    description: row['description'] || null,
                    location: row['location'] || null,
                    startsOn: row['startsOn'] || null,
                    endsOn: row['endsOn'] || null,
                    categoryNames: (row['categoryNames'] || '').replaceAll("'", '').replace('[', '').replace(']', '').split(',').map(s => s.trim()).filter(Boolean),
                };
                const result = await collection.insertOne(objectToInsert);
                console.log(`Inserted row for organization "${objectToInsert.organizationName}" with _id: ${result.insertedId}`);
            } catch (e) {
                console.error('Failed to insert row:', e);
            }
        }

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Ensure client is closed only after all async inserts complete
        try {
            await client.close(); // Close the connection when done
            console.log('MongoDB connection closed.');
        } catch (e) {
            console.error('Error closing MongoDB client:', e);
        }
    }
}

connectToMongoDB().catch(err => console.error(err));