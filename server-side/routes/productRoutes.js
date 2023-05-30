const express = require('express');
const router = express.Router();
const multer = require('multer');
// const uploadOptions = require('../productControllers')
const { postProduct,uploadOptions, getProducts, getProduct,featuredProducts,galleryImages, countProducts, deleteProduct, updateProduct} = require('../productControllers');


router.get('/getProducts', getProducts);
router.get('/getProduct/:id', getProduct);
router.get("/countProducts", countProducts);
router.get("/featured/:count", featuredProducts);
router.post('/postProduct', [uploadOptions.single('image'), postProduct]);
router.delete('/:id', deleteProduct);
router.put('/galleryImages:id', [uploadOptions.single('images', galleryImages)])
router.put('/:id', updateProduct);

module.exports = router;