import { connectToDatabase } from '../../lib/mongodb';

async function handler(req, res) {
    if (req.method === 'POST') {
        /**
         * Body format:
         * "category" : "category 1"
         **/
        const { date, category } = req.body;
        if (!date || !category)
            return res.status(400).json({ message: 'Requested body data are missing!' });
            
        const client         = await connectToDatabase();
        const db             = client.db('calendar');
        const collection     = db.collection('todolist');
        const data           = await collection.find({'_id': date}).toArray();

        if (data.length === 0) {
            const todo   = {
                [category] : {}
            };
            const result = await collection.insertOne({"_id": date, todo});

            res.status(201).json({ message: 'Task added successfully!', id: result.insertedId });
        }
        else {
            const filter = { "_id": date };
            const update = { $set: { [`todo.${category}`]: {} } };
            const result = await collection.updateOne(filter, update);

            res.status(200).json({ message: 'Task updated successfully!' });
        }
    }
    else if (req.method === 'DELETE') {
        /**
         * Body format:
         * "body" : {
         *      "title": "Todo 1",
         *      "done": true
         * }  
         **/
        const { date, todo_id } = req.body;
        if (!date || !todo_id)
            return res.status(400).json({ message: 'Requested body data are missing!' });

        const client = await connectToDatabase();
        const db = client.db('calendar');
        const collection = db.collection('todolist');
        const data = await collection.find({ '_id': date }).toArray();

        if (data.length === 0) {
            return res.status(404).json({ message: 'Data not found!' });
        } else {
            const filter = { "_id": date };
            const update = { $unset: { [`todo.${todo_id}`]: "" } };
            const result = await collection.updateOne(filter, update);

            res.status(200).json({ message: 'Task deleted successfully!' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;