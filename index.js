const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.port || 3200;
const app = express();
// Messi@100
// mumitkhan85@gmail.com
app.use(cors());
app.use(express.json());

/////////// from chatgpt
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
 const uri = process.env.MONGODB_URI;//here %40 is @
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
 
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("userDB");
    const userCollection = database.collection("user");
    app.get("/user",async(req,res)=>{
      const cursor = userCollection.find(); // this will fetch data from database 
      const result = await cursor.toArray(); // this will give the data to server and it need to be array-ed before the operation
      res.send(result);
    })
    app.post("/user", async(req,res)=>{
        const user = req.body;
        console.log(user,"  this is user");
        const result = await userCollection.insertOne(user);
        res.send(result)
    })
    app.delete("/user/:id", async(req,res)=>{
      const id = req.params.id;
      console.log("this will be delete" , id);
      const query = {_id : new ObjectId(id)} 
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get('/',(req,res)=>{
    res.send("simple crud is running")
})
app.listen(port, ()=>{
    console.log(`crud is on at ${port}`);
})
/*
------
mongoDB connection
---------
1.create account 
2.create an user with pass
3.whitelist IP address to all
4. database > connect > driver > node > view full code
5. change the password
----------------------------
POST ********************
------------------------ 
1.app.post("/users",async (req,res)=>{}) 
2. wee need to async post operation's function to use use await inside it
3. to get data from frontend we need to use middleware express.json()
4.to get data from body(frontend) : const userData : req.body;
5. const result = await usercollection.insertone(doc);
6. res.send(result);

CLIENT 
1.create fetch
2. add second parameter as an object
3. provide method : "POST"
4. add headers : {"content-type":"application/json"}
5. add body : JSON.Stringify(user);

------------------
READ MANY ***************
____________________
(this basically getiing data from database and will put these data to my server)
1. create a cursor = userCOllection.find()
2. const result = await cursor.toArray() {this will make the data an array and will put the data to my server}
 

CLIENT
1.normal fetch


_________________________
Delete ********************
___________________________
1.specify unique objectID to delete  the right user and write => "/user/:id" 
2. const query = {_id: new objectID(id)}


CLIENT 
1. just mention the method delete and use dynamic url for id



source : search "Node mongoDb crud (as for now ver: v5.3(current))"
*/