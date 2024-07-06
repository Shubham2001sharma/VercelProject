const { MongoClient } = require('mongodb');

const MONGO_DB_URI = 'mongodb+srv://sharmashubu4600:pKHWJWZI2YKqIj9g@project.beleaer.mongodb.net/test?retryWrites=true&w=majority&appName=project';
const MONGO_DB_NAME = 'project';

let db;

const connectToDb = async () => {
    if (db) return db;
    try {
        const client = new MongoClient(MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
            connectTimeoutMS: 30000,
        });
        await client.connect();
        db = client.db(MONGO_DB_NAME);
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
        throw error;
    }
};

module.exports = connectToDb;
