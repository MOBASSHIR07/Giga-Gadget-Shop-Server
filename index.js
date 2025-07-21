const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

//
//




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ht5sdry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const productCollection = client.db("GadgetShop").collection("products");


    //for add product
    app.post('/addproduct', async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.send(result)
    })


    //for get products by adding person
    app.get('/getproduct/:email', async(req,res)=>{
             console.log(req.params);
             const email = req.params.email;
             const result = await productCollection.find({email:email}).toArray();
             res.send(result);
    })

    //get single product by id
    app.get('/singleproduct/:id', async(req,res)=>{
      const id = req.params.id;
      const objectId = new ObjectId(id)
      const result = await productCollection.findOne({_id:objectId})
      res.send(result);
    })
    //update products by id
    app.put('/updateproduct/:id', async(req,res)=>{
      const id = req.params.id;
      const objectId = new ObjectId(id)
      const query = {_id:objectId}
      const data = {
        $set:{
          name: req.body.name,
          price:req.body.price,
          brand:req.body.brand,
          category:req.body.category
        }
      }
      const result = await productCollection.updateOne(query,data);
      res.send(result);
    })

    //delete products
    app.delete('/deleteproduct/:id', async(req,res)=>{
      const id = req.params.id;
      const objectId = new ObjectId(id);
      const result = await productCollection.deleteOne({_id:objectId})
      res.send(result);
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


app.get('/', (req, res) => {
  res.send("Gadget server is running")
})

app.listen(port, () => {
  console.log(`Gadget shop running on port ${port}`);
})