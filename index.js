const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
// app.use(cookieParser())
// books962
// xExML1Yy56oK9S0G

// const uri = "mongodb+srv://books962:xExML1Yy56oK9S0G@cluster1.uxt0zs4.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.uxt0zs4.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const bookcardsCollection = client.db('bookcardDB').collection('bookcards')
    const bookCollection = client.db('allbooksDB').collection('allbooks')
    const addbookCollection = client.db('addbookDB').collection('addbooks')

    // app.post('/jwt', async(req, res) => {
    //   const body = req.body;
    //   // jwt.sign('payload', 'secretKey', 'expireInfo')

    //   const token = jwt.sign(body, process.env.SECRET, {expiresIn: "10h"})
    //   res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none"
    //   }).send({msg: 'succeed'})
    //   // res.send({body, token})
    // })

    // const verifytoken = (req, res, next) => {
    //   const token = req?.cookies?.token
    //   if(!token){
    //     return res.status(404).send({message: 'unAuthorized access'})
    //   }
    //   jwt.verify(token, process.env.SECRET, (err, decoded) => {
    //     if(err){
    //       return res.status(401).send({message: 'unAuthorized access'})
    //     }
    //     req.user = decoded
    //     next()
    //   })
    // }

    app.get('/bookcards', async(req, res) => {
        const result = await bookcardsCollection.find().toArray();
        res.send(result)
    })

    app.post('/allbooks', async(req, res) => {
      const user = req.body;
      const result = await bookCollection.insertOne(user)
      res.send(result)
    })

    app.get('/allbooks', async(req, res) => {
      const result = await bookCollection.find().toArray()
      res.send(result)
    })

    app.get('/allbooks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookCollection.findOne(query)
      res.send(result)
    })

    app.put('/allbooks/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatebody = req.body;
      const updatebook = {
        $set: {
          name: updatebody.name,
          photo: updatebody.photo,
          // quantity: updatebody.quantity,
          author: updatebody.author,
          category: updatebody.category,
          // description: updatebody.description,
          rating: updatebody.rating,
          // read_description: updatebody.read_description
        }
      }
      const result = await bookCollection.updateOne(filter, updatebook, options)
      res.send(result)
    })

    app.post('/addbooks', async(req, res) => {
      const user = req.body;
      const result = await addbookCollection.insertOne(user)
      res.send(result)
    })

    app.get('/addbooks', async(req, res) => {
      const result = await addbookCollection.find().toArray();
      res.send(result)
    })

    app.delete('/addbooks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const result = await addbookCollection.deleteOne(query)
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
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('my book server')
})

app.listen(port, () =>{
    console.log(`library server is running on port: ${port}`);
})