const express = require("express") 
const {getProducts, addProduct, getSingleProduct, editProduct, deleteProduct} = require("../controllers/productController")
const router = express.Router()

router.get("/", getProducts)

router.get("/:id", getSingleProduct)

router.post("/", addProduct)

router.put("/:id", editProduct)

router.delete("/:id", deleteProduct)

module.exports = router