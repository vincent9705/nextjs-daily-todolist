import { connectToDatabase } from '../lib/db';

async function handler(req, res) {
  const client = await connectToDatabase();

  // Use the client object to query the database
  const db = client.db();
  const data = await db.collection('todolist').find().toArray();

  res.status(200).json(data);
}

export default handler;
