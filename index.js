const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())

// 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afhro9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        
        // await client.connect();
        const database = client.db("spotsDB");
        const spotCollection = database.collection("spotCollection");


        app.post('/spots',async(req,res)=>{
            const data=req.body;
            const result=await spotCollection.insertOne(data)
            res.send(result);

        })
        app.get('/spots',async(req,res)=>{
            const query= spotCollection.find()
            const result= await query.toArray()
            res.send(result)
        })
        app.get('/spots/:id',async(req,res)=>{
            const id = req.params.id;
            const query={_id: new ObjectId (id)}
            const result= await spotCollection.findOne(query)
            res.send(result)
        })

        app.put('/spots/:id',async(req,res)=>{
            const id =req.params.id
            const user= req.body;
            const query= {_id: new ObjectId (id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    image: user.image,
                    tourists_spot_name: user.tourists_spot_name,
                    country:user.country,
                    location: user.location,
                    average_cost: user.average_cost,
                    seasonality: user.seasonality,
                    travel_time: user.travel_time,
                    totalVisitorsPerYear: user.totalVisitorsPerYear,
                    description: user.description
                },
            };
            const result=await spotCollection.updateOne(query,updateDoc,options)
            res.send(result)
        })

        app.delete('/spots/:id',async(req,res)=>{
            const id =req.params.id;
            const query={_id: new ObjectId(id)}
            const result=await spotCollection.deleteOne(query)
            res.send(result)
        })
       









        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('assignment server site...........')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})