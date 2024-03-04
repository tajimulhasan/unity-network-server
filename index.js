const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) =>{
    res.send(' Unity Network is running')
});

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-unitynetwoerk.lpkfeil.mongodb.net/?retryWrites=true&w=majority&appName=cluster-UnityNetwoerk`;

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
    await client.connect();
    const netwrokCollection = client.db("UnityNetwork").collection("unityNetwork");
    const volunteerCollection = client.db("UnityNetwork").collection("volunteerRegiList");
    app.get("/allevents", async(req, res) =>{
    const query = {};
    const cursor = netwrokCollection.find(query);
    const allEvents = await cursor.toArray();
    res.send(allEvents);        
    });

   //regiList get
     app.get("/admin/regilist", async(req, res) =>{
      const query = {};
      const cursor = volunteerCollection.find(query);
      const regiList = await cursor.toArray();
      res.send(regiList);
     });
    //POST
    app.post("/allevents", async(req, res) =>{
     const newAdding = req.body;
     const result = await netwrokCollection.insertOne(newAdding);
     res.send(result);
    });

    //POST regilist send
    app.post('/signup', async(req, res) =>{
      const newAdding = req.body;
      const result = await volunteerCollection.insertOne(newAdding);
      res.send(result);
    }); 
     
    //delete regilist user
    app.delete("/admin/regilist/:id", async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.deleteOne(query);
      res.send(result)
    })
 
  }
  finally{

  }
}
run().catch(console.dir);


app.listen(port, () =>{
    console.log('Unity Network port is runnig', port)
})