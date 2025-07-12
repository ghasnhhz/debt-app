const express = require("express")
const { getCustomers, addCustomer, editCustomer } = require("../controllers/customerController")
const {addDebt, getCustomerDebt} = require("../controllers/debtController")
const router = express.Router()

router.get("/", getCustomers)

router.get("/:id/debts", getCustomerDebt)

router.post("/", addCustomer)

router.post("/:id/debts", addDebt)

router.put("/:id", editCustomer)



module.exports = router