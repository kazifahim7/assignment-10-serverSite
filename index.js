const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())

//country data add to dataBase..........

const countries = [
    {
        "id": 1,
        "image": "https://i.ibb.co/XYsg4Kb/m003t0680-a-bangladesh-02dec22.jpg",
        "country_name": "bangladesh",
        "description": "Bangladesh is a country of immense natural beauty and rich cultural heritage, renowned for its lush landscapes, verdant deltas, and the longest natural unbroken sea beach in the world. It is also home to the diverse wildlife of the Sundarbans, the largest mangrove forest on earth."
    },
    {
        "id": 2,
        "image": "https://i.ibb.co/58wk2w9/thailand-national-flag-isolated-3d-white-background.jpg",
        "country_name": "thailand",
        "description": "Thailand is a Southeast Asian country known for its opulent royal palaces, ancient ruins, ornate temples displaying figures of Buddha, and vibrant street life. The country's major tourist attractions include bustling Bangkok, historical Ayutthaya, and the picturesque islands of Phuket and Koh Samui."
    },
    {
        "id": 3,
        "image": "https://i.ibb.co/ZM161bW/waving-flag-monaco-background.jpg",
        "country_name": "indonesia",
        "description": "Indonesia, the world's largest archipelago, offers an adventure for everyone, from exploring ancient temples and hiking active volcanoes to diving in largely untouched waters. You can see dramatic landscapes throughout its many islands, which are home to diverse cultures and a wide array of wildlife."
    },
    {
        "id": 4,
        "image": "https://i.ibb.co/wr3vcPj/mkjr-ru6-Mp7-W-Ul-I-unsplash.jpg",
        "country_name": "malaysia",
        "description": "Malaysia is a country that boasts stunning diversity in its geography, culture, and activities. From the iconic Petronas Twin Towers in its bustling capital, Kuala Lumpur, to the tranquil islands of Langkawi and the biodiversity-rich rainforests of Borneo, Malaysia offers a unique mix of modernity and tradition."
    },
    {
        "id": 5,
        "image": "https://i.ibb.co/wW3bCQ1/sam-williams-v-Omdowu8-F2-Y-unsplash.jpg",
        "country_name": "vietnam",
        "description": "Vietnam is a country with a rich history dating back thousands of years, with ancient traditions, bustling markets, vibrant cities, and diverse landscapes ranging from green rice paddies in the north to tropical beaches in the south. It is renowned for its cuisine, culture, and the iconic Ha Long Bay."
    },
    {
        "id": 6,
        "image": "https://i.ibb.co/HNg0wNZ/thoeun-ratana-x-UHMPr-JPH8-unsplash.jpg",
        "country_name": "cambodia",
        "description": "Cambodia is known for its breathtaking temples, including the world-famous Angkor Wat, and its vibrant capital city, Phnom Penh. It has a dark history visible through its genocide memorials, but today it is a country of vibrant markets, friendly locals, and a rich cultural heritage waiting to be explored."
    }
]









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

        const country = client.db("countryDB");
        const countryCollection = country.collection("countryCollection");

        app.get('/country',async(req,res)=>{
            res.send(countries)
        })
        app.get('/country/:id',async(req,res)=>{
            const id = parseInt(req.params.id);
            const remain=countries.find(country=>country.id===id)
            
            
            res.send(remain)
        })






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