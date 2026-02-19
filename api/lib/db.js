const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        console.log("Menggunakan koneksi database yang sudah ada");
        return cachedDb;
    }

    console.log("Membuat koneksi database baru...");
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();
    const db = client.db("zikanime");

    cachedClient = client;
    cachedDb = db;

    console.log("Koneksi database berhasil");
    return db;
}

module.exports = connectToDatabase;
