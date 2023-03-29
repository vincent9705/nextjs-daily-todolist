import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let cachedClient = null;

export async function connectToDatabase() {
  // if (cachedClient && typeof cachedClient.isConnected === 'function' && cachedClient.isConnected()) {
  //   return cachedClient;
  // }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);

  cachedClient = client;

  return client;
}
