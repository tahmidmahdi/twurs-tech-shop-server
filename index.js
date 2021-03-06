const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()



app.use(cors())
app.use(bodyParser.json())
const { ObjectId } = require('bson');
const { MongoClient } = require('mongodb');


const port =  process.env.PORT || 4000 





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fckrr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

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


  // checkout product from a cart
  app.post('/checkout/buy', (req, res) => {
    console.log(req.body)
    buyingCollection.insertOne(req.body)
      .then(console.log('added to buying cart'))
  })


  //  user dashboard products find by email
  app.get('/dashboard/:email', (req, res) => {
    console.log(req.params.email)
    buyingCollection.find({ email: req.params.email })
      .toArray((err, collections) => {
        res.send(collections)
      })
  })


  //  making an admin by adding a email
  app.post('/makeAnAdmin', (req, res) => {
    console.log(req.body)
    adminCollection.insertOne(req.body)
      .then(console.log('added to admin cart'))
  })

 //  this is to get the admin list
  app.get('/adminList', (req, res) => {
    adminCollection.find({})
      .toArray((err, collections) => {
        res.send(collections)
      })
  })
  
  // this route is for delete a product, only admin can delete
  app.post('/deleteProduct', (req, res)=> {
     console.log(req.body)
     productsCollection.deleteOne({_id: ObjectId(req.body.id)})
     .then('deleted Successfully')
  })

  // to edit a product by an admin
  app.post('/editProduct', (req, res) => {

    console.log(req.body)

    productsCollection.updateOne(
      { _id: ObjectId(req.body._id) },
      {
        $set: { "quantity": req.body.quantity },
        $currentDate: { lastModified: true }
      })
    
  })
  

})








app.get('/', (req, res) => {
  res.send('Hello This Is Twurs Tech Shop!')
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})