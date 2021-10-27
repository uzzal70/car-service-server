const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

// middelware 
app.use(cors());
app.use(express.json());

// Database username and password setup  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j502d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run()
{
    try {
        await client.connect();
        const database = client.db("carMechanic"); //Database Name
        const servicesCollection = database.collection('services'); //service database ar collection name 

        //GET API
        app.get('/services', async (req, res) =>
        {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET Single API
        app.get('/services/:id', async (req, res) =>
        {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // Post API 
        app.post('/services', async (req, res) =>
        {
            const service = req.body;
            console.log('hit the button ', service)

            // carMechanic name akta database create kore data pathi dibe 
            const result = await servicesCollection.insertOne(service);
            console.log('result');
            res.json('result');

        });
        //Delete API
        app.delete('/services/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);
// '/' = root a pathanor jonno 
app.get('/', (req, res) =>
{
    res.send('running ginuis server');

});
app.listen(port, () =>
{
    console.log('This server is runnig');
})
