const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())
const { ObjectId } = require('bson');
const { MongoClient } = require('mongodb');


const port = 4000





const uri = "mongodb+srv://Twurs-Admin:Twurspass123@cluster0.fckrr.mongodb.net/Twurs-Tech-Shop?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("Twurs-Tech-Shop").collection("products");
  console.log('databaseConnected')


  //to add products to database
  app.post('/addProduct', (req, res) => {
    console.log(req.body)
    productsCollection.insertOne(req.body)
      .then(console.log('added Successfully'))
  })
  

  app.get('/allProducts', (req, res) => {
      productsCollection.find({})
      .toArray((err, collections) => {
          res.send(collections)  
      })
  })



  app.get('/getProductData/:data', (req, res) => {
      console.log(req.params.data)
      productsCollection.find({_id : ObjectId(req.params.data)})
      .toArray((err, collections)=> {
        console.log(collections)
        res.send(collections)
      })
  })


});




app.get('/', (req, res) => {
  res.send('Hello World!')
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})