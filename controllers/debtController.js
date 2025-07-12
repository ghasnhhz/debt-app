const {ObjectId} = require("mongodb")
const connectDB = require("../database/connect")

async function getDebts(req, res, next) {
  try {
    const db = await connectAndReturnDb()
    const debts = await db.collection("debts").find().toArray()

    if (debts.length === 0) {
      return res.status(200).json({message: "No depts added yet"})
    }

    res.status(200).json(debts)
  } catch (err) {
    next(err)
  }
}

async function getSingleDebt(req, res, next) {
  try {
    const debtId = new ObjectId(req.params.id)

    const db = await connectAndReturnDb()

    const debt = await db.collection("debts").findOne({ _id: debtId })
    
    res.status(200).json(debt)
  } catch (err) {
    next(err)
  }
}

async function getCustomerDebt(req, res, next) {
  try {
    const db = await connectAndReturnDb()
    const customerId = new ObjectId(req.params.id)
    
    const customer = await db.collection("debts").aggregate([
    {
      $match: {
        customerId
      }  
    },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    {
      $project: {
        customerId: 0
      }
    }
    ]).toArray()

    res.send(customer)
  } catch (err) {
    next(err)
  }
}

async function addDebt(req, res, next) {
  try {
    const db = await connectAndReturnDb()

    const customerId = new ObjectId(req.params.id)
    const givenTime = new Date()
    const debtInfo = req.body
    debtInfo.customerId = customerId
    debtInfo.givenTime = givenTime

    const result = await db.collection("debts").insertOne(debtInfo)
    
    res.status(201).json({
      message: "Debt added successfully",
      debtId: result.insertedId
    })
  } catch (err) {
   next(err)
  }
}


async function editDebt(req, res, next) {
  try {
    const debtId = new ObjectId(req.params.id)

    const db = await connectAndReturnDb()

    const editedDebt = req.body
    const debt = await db.collection("debts").updateOne({
      _id: debtId
    }, {
      $set: editedDebt
    })

    if (debt.matchedCount === 0) {
      res.status(404).json({message: "Debt not found"})
    }
    
    res.status(200).json({
      message: "Debt edited successfully",
      debtId
    })
  } catch (err) {
   next(err)
  }
}


async function deleteDebt(req, res, next) {
  try {
    const debtId = new ObjectId(req.params.id)
    const db = await connectAndReturnDb()
    const debt = await db.collection("debts").findOne({ _id: debtId })
    await db.collection("debts").deleteOne({ _id: debtId })
    
    const customerId = debt.customerId
    const customer = await db.collection("customers").aggregate([ {$match: { _id: customerId }}, {$project: {"cutomerId": 0}} ])
    await db.collection("customers").deleteOne({_id: customerId})
    
    res.status(200).json({
      message: "customer and their debt have been successfully removed from the debts",
      customer,
      debt
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

module.exports = {getDebts, getSingleDebt, getCustomerDebt, addDebt, editDebt, deleteDebt}