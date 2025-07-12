const {ObjectId} = require("mongodb")
const connectDB = require("../database/connect")

async function getProducts(req, res, next) {
  try {
    const db = await connectAndReturnDb()
    const products = await db.collection("products").find().toArray()

    if (products.length === 0) {
      return res.status(404).json({error: "Do not have products yet"})
    }

    res.status(200).json(products)
  } catch (err) {
     next(err)
  }
}

async function getSingleProduct(req, res, next) {
  try {
    const id = new ObjectId(req.params.id)

    const db = await connectAndReturnDb()

    const product = await db.collection("products").findOne({ _id: id })
    
    res.status(200).json(product)
  } catch (err) {
    next(err)
  }
}

async function addProduct(req, res, next) {
  try {
    const newProduct = req.body

    const db = await connectAndReturnDb()
    const result = await db.collection("products").insertOne(newProduct)

    res.status(201).json({
      message: "Product added successfully",
      insertedId: result.insertedId
    })
  } catch (err) {
    next(err)
  }
}

async function editProduct(req, res, next) {
  try {
    const productId = new ObjectId(req.params.id)
    const editedProduct = req.body

    const db = await connectAndReturnDb()

    const product = await db.collection("products").updateOne({
      _id: productId
    }, {
      $set: editedProduct
    })

    if (product.matchedCount === 0) {
      return res.send(404).json({message: "Product not found"})
    }
    
    res.status(200).json({
      message: "Product edited successfully",
      productId
    })
  } catch (err) {
    next(err)
  }
}

async function deleteProduct(req, res, next) {
  try {
    const productId = new ObjectId(req.params.id)

    const db = await connectAndReturnDb()

    const deletedProduct = await db.collection("products").findOne({ _id: productId })
    await db.collection("products").deleteOne({ _id: productId })
    
    if (!deletedProduct) {
      return res.status(404).json({message: "No product found"})
    }
    
    res.status(200).json({
      message: "Product removed successfully",
      product: deletedProduct
    })
  } catch (err) {
    next(err)
  }
}

async function connectAndReturnDb(next) {
  try {
    const db = await connectDB()
    return db
  } catch (err) {
    next(err)
  }
}

module.exports = {getProducts, addProduct, getSingleProduct, editProduct, deleteProduct}