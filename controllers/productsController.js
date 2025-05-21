const {validationResult} = require('express-validator');
const fs = require('fs-extra');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const productsPath = path.join(__dirname, '../data/products.json');

const readProducts = async() => {
    const data = await fs.readFile(productsPath, 'utf-8');
    return data;
}

const writeProducts = async(data) => {
    await fs.writeJSON(productsPath, data);
}

const getAllProducts = async(req, res) => {
    try {
        const products = await readProducts();
        res.status(200).json(JSON.parse(products));
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error getting products"})
    }
}

const getProductById = async(req, res) => {
    try {
        const products = await readProducts();
        const parsedProducts = JSON.parse(products);
        const product = parsedProducts.find (p => p.id === req.params.id);

        if (!product) {
            return res.status(404).json({message: "Product not found :("});
        }

        res.status(200).json(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error getting product by id"})
    }
}

const createProduct = async(req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});  
    }
    try {
        
        const products = await readProducts();
        const parsedProducts = JSON.parse(products);
        console.log(parsedProducts);
        
        const newProduct = {
            id: uuidv4(),
            name: req.body.name,
            price: parseInt(req.body.price),
            description: req.body.description
        }

        parsedProducts.push(newProduct);
        await writeProducts(parsedProducts);
        res.status(201).json(newProduct);

    } catch (error) {
        next(error);
    }
}

const updateProduct = async(req, res) => {
    try {
        const {id} = req.params;
        const {name, price, description} = req.body;
        const products = await readProducts();
        const parsedProducts = JSON.parse(products);

        const productIndex = parsedProducts.findIndex(p => p.id === id);

        if(productIndex === -1){
            return res.status(404).json({message: "Product not found :("});
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const updatedProduct = {
            ...parsedProducts[productIndex],
            name: name || parsedProducts[productIndex].name,
            price: price !== undefined ? parseInt(price) : parsedProducts[productIndex].price,
            description: description || parsedProducts[productIndex].description
        }

        parsedProducts[productIndex] = updatedProduct;
        await writeProducts(parsedProducts);
        res.status(200).json(updatedProduct);


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error updating product"})
    }
}

const deleteOneProduct = async(req, res) => {
    try {
        const {id} = req.params;
        const products = await readProducts();
        const parsedProducts = JSON.parse(products);

        const index = parsedProducts.findIndex(p => p.id === id);

        if(index === -1){
            return res.status(404).json({message: "Product not found :("});
        }

        const deletedProduct = parsedProducts.splice(index, 1);
        await writeProducts(parsedProducts);
        res.status(200).json(deletedProduct[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error deleting product"})
    }
}

const findProductsByFilters = async(req, res) => {
    try {
        const products = await readProducts();
        const parsedProducts = JSON.parse(products);
        let filteredProducts = parsedProducts;
    
        if(req.query.name){
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(req.query.name.toLowerCase()));
        }

        if(req.query.price){
            filteredProducts = filteredProducts.filter(p => p.price === parseInt(req.query.price));
        }

        if(req.query.description){
            filteredProducts = filteredProducts.filter(p => p.description.toLowerCase().includes(req.query.description.toLowerCase()));
        }

        res.status(200).json(filteredProducts);


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error finding products by filters"})
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteOneProduct,
    findProductsByFilters
}