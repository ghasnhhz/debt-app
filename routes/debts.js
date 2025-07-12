const express = require("express")
const {getDebts, getSingleDebt, editDebt, deleteDebt} = require("../controllers/debtController")
const router = express.Router()

router.get("/", getDebts)

router.get("/:id", getSingleDebt)

router.put("/:id", editDebt)

router.delete("/:id", deleteDebt)

module.exports = router
