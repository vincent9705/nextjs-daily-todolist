import { connectToDatabase } from '../../lib/mongodb';
import { format, addDays } from 'date-fns'

async function handler(req, res) {
    if (req.method === 'POST') {
        /**
         * Body format: {
         *    "category1": {
         *         "1": {
         *             "title": "title"
         *             "done" : false
         *         }
         *    }
         * }
         **/
        const { date_from, date_to, body } = req.body;
        if (!date_from || !date_to || !body)
            return res.status(400).json({ message: 'Requested body data are missing!' });
            
        const client     = await connectToDatabase();
        const db         = client.db('calendar');
        const collection = db.collection('todolist');
        const todo       = body;
        const startDate  = new Date(date_from);
        const endDate    = new Date(date_to);
        const dates      = [];
        let currentDate  = startDate;
      
        try {
            while (currentDate <= endDate) {
                dates.push(currentDate)
                const result = await collection.insertOne({"_id": format(currentDate, "yyyy-MM-dd"), todo});
                currentDate = addDays(currentDate, 1)
            }
            res.status(201).json({ message: 'Task added successfully!', dates });
        } catch (error) {
            res.status(400).json({ message: 'Task added failed!', error });
        }

    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;