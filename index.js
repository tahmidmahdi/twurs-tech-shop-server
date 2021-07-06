const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()



app.use(cors())
app.use(bodyParser.json())
const { ObjectId } = require('bson');
const { MongoClient } = require('mongodb');


const port = 4000 || process.env.PORT 





const uri = "mongodb+srv://Twurs-Admin:Twurspass123@cluster0.fckrr.mongodb.net/Twurs-Tech-Shop?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("Twurs-Tech-Shop").collection("products");
  const cartCollection = client.db("Twurs-Tech-Shop").collection("cart");
  const buyingCollection = client.db("Twurs-Tech-Shop").collection("buy");
  const adminCollection = client.db("Twurs-Tech-Shop").collection("admin");
  console.log('databaseConnected')


  //to add products to database
  app.post('/addProduct', (req, res) => {
    console.log(req.body)
    productsCollection.insertOne(req.body)
      .then(console.log('added Successfully'))
  })

  //api to get all the products
  app.get('/allProducts', (req, res) => {
    productsCollection.find({})
      .toArray((err, collections) => {
        res.send(collections)
      })
  })


  // this is to show a specific product
  app.get('/getProductData/:data', (req, res) => {
    console.log(req.params.data)
    //finding product by using unique id
    productsCollection.find({ _id: ObjectId(req.params.data) })
      .toArray((err, collections) => {
        console.log(collections)
        res.send(collections)
      })
  })


  //  to add products to the cart collection 
  app.post('/cartData', (req, res) => {
    console.log(req.body)
    cartCollection.insertOne(req.body)
      .then(console.log(`added successfully`))
  })


  //  this api is for updating a products quantity
  app.post('/updateData', (req, res) => {
    console.log(req.body)
    productsCollection.updateOne(
      { _id: ObjectId(req.body._id) },
      {
        $set: { "quantity": req.body.quantity },
        $currentDate: { lastModified: true }
      })
  })


  // search a user cart product by his email
  app.get('/cartByEmail/:email', (req, res) => {
    console.log(req.params.email)
    cartCollection.find({ email: req.params.email })
      .toArray((err, collections) => {
        res.send(collections)
      })


  })



  app.post('/checkout/buy', (req, res) => {
    console.log(req.body)
    buyingCollection.insertOne(req.body)
      .then(console.log('added to buying cart'))
  })

  app.get('/dashboard/:email', (req, res) => {
    console.log(req.params.email)
    buyingCollection.find({ email: req.params.email })
      .toArray((err, collections) => {
        res.send(collections)
      })
  })

  app.post('/makeAnAdmin', (req, res) => {
    console.log(req.body)
    adminCollection.insertOne(req.body)
      .then(console.log('added to admin cart'))
  })


  app.get('/adminList', (req, res) => {
    adminCollection.find({})
      .toArray((err, collections) => {
        res.send(collections)
      })
  })
  

  app.post('/deleteProduct', (req, res)=> {
     console.log(req.body)
     productsCollection.deleteOne({_id: ObjectId(req.body.id)})
     .then('deleted Successfully')
  })
  

})








app.get('/', (req, res) => {
  res.send('Hello World!')
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})