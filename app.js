require("dotenv").config({quiet: true});
const express = require("express")
const customers = require("./routes/customers")
const debts = require("./routes/debts")
const products = require("./routes/products")
const errorHandler = require("./middlewares/internalError")
const app = express()

const port = process.env.PORT || 3000;

app.use(express.json())
app.use("/customers", customers)
app.use("/debts", debts)
app.use("/products", products)

app.use((req, res) => {
  res.status(404).json({error: "Route not found"})
})

// This middleware is run if an error, in a route, occurs
app.use(errorHandler)

app.listen(port, () => {
  console.log("App is listening on: http://localhost:3000")
}) 