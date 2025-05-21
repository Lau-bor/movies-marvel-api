var express = require('express');
const { findProductsByFilters, getAllProducts, createProduct, updateProduct, deleteOneProduct, getProductById } = require('../controllers/productsController');
const { ValidateCreateProduct, ValidateUpdateProduct } = require('../validators/productValidator');
var router = express.Router();

router.get('/', (req, res, next) => {
    if(Object.keys(req.query).length > 0){
        findProductsByFilters(req, res, next)
    } else {
        getAllProducts(req, res, next)
    }
})

router.get('/:id', getProductById)
router.post('/',  ValidateCreateProduct, createProduct)
router.put('/:id', ValidateUpdateProduct, updateProduct)
router.delete('/:id', deleteOneProduct)

module.exports = router;