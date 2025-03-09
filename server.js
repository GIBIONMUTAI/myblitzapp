const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://trainingDB:dYxU3e6mYlW8hoxX@cluster0.pwexv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(mongoURI);
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToDatabase();

app.use(bodyParser.json());

app.post('/enroll', async (req, res) => {
  try {
    const { name, email, courseType, examDate, examLocation, schoolName, courseApplied, contactName, contactEmail, message } = req.body;
    let collection, result, messageString;

    if (name && email && courseType) {
      collection = db.collection('trainingDB');
      result = await collection.insertOne({ name, email, courseType });
      messageString = 'Enrollment successful';
    } else if (examDate && examLocation) {
      collection = db.collection('exam');
      result = await collection.insertOne({ examDate, examLocation });
      messageString = 'Booking successful';
    } else if (schoolName && courseApplied) {
      collection = db.collection('school_applications');
      result = await collection.insertOne({ schoolName, courseApplied });
      messageString = 'Application successful';
    } else if (contactName && contactEmail && message) {
      collection = db.collection('contact_messages');
      result = await collection.insertOne({ contactName, contactEmail, message });
      messageString = 'Message sent successfully';
    } else {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (result && result.acknowledged) {
      res.json({ message: messageString, insertedId: result.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to process request' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});