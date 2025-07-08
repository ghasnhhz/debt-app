const {ObjectId} = require("mongodb")
const connectDB = require("../database/connect")

async function getCustomers(req, res, next) {
  try {
    const customersCollection = await connectAndReturnCollection()

    const { name } = req.query
    
    if (name) {
      const members = await customersCollection.find({ name: name }).toArray()
      return res.status(200).json(members)
    }

    const allCustomers = await customersCollection.find().toArray()

    if (allCustomers.length === 0) {
      return res.status(200).json({message: "Do not have customers yet"})
    }

    res.status(200).json(allCustomers)
  } catch (err) {
    next(err)
  }
}

async function addCustomer(req, res, next) {
  try {
    const customer = req.body

    const customersCollection = await connectAndReturnCollection()
    const result = await customersCollection.insertOne(customer)
    console.log("A new customer is succeessfully inerted to customers Collection")
    
    res.status(201).json({
      message: "Customer created",
      customerID: result.insertedId
    })
  } catch (err) {
    next(err)
  }
}

async function editCustomer(req, res, next) {
  try {
    const customerId = new ObjectId(req.params.id)
    const editedInfo = req.body

    const customersCollection = await connectAndReturnCollection()

    const customer = await customersCollection.updateOne({
      _id: customerId
    }, {
      $set: editedInfo
    })

    if (customer.matchedCount === 0) {
      res.status(404).json({error: "Customer not found"})
    }
    
    res.status(200).json({message: "Customer updated successfully"})
  } catch (err) {
    next(err)
  }
}

async function connectAndReturnCollection(next) {
  try {
    const db = await connectDB()
    const customersCollection = db.collection("customers")
    return customersCollection
  } catch (err) {
    next(err)
  }
}

module.exports = {getCustomers, addCustomer, editCustomer}