const categoryModels = require('./models/categoryModels');
const productModel = require('./models/productModel')
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');
    if(isValid){
      uploadError = null;
    }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb){
    
    const fileName = file.originalname.split('.').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName} -${Date.now()}.${extension}`)
  }
})

const uploadOptions =
   multer({storage: storage})

// get all the products in stock
const getProducts = async(req, res) => {
    try {
      //tending to query requests for categories
      let filter = {};
      if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
      }
         const Products = await productModel.find(filter).populate('category');
         console.log(Products);
         if(!Products){
          res.status(500).json({success: false})
          console.error(error);
         }
         else{
         res.status(200).json(Products);
         }
    } catch (error) {
          console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
    }
}

//post new products to the store

const postProduct = async(req,res) =>
{
  try {
      const category = await categoryModels.findById(req.body.category)
      if(!category){
        return res.status(400).json({message: 'Invalid Category!'})
      }
      const file = req.file;
      if(!file){
        return res.status(400).json('No image in the request')
      }
      const fileName = req.file.filename;
      const basePath =`${req.protocol}://${req.get('host')}/public/upload/`;


        const product = new productModel({
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          image: `${basePath}${fileName}`, //"http://localhost:5003/public/upload/image-2323232",
          brand: req.body.brand,
          price: req.body.price,
          size: req.body.size,
          category: req.body.category,
          countInStock: req.body.countInStock,
          rating: req.body.rating,
          numReviews: req.body.numReviews,
          isFeatured: req.body.isFeatured,
        })
        
        
          // product = await product.create()
          const createdProduct = await product.save();
          if(!createdProduct) {
            return res.status(400).json({error:'The product cannot be created'});
        }
          console.log(createdProduct);
          return res.status(201).json(createdProduct);
        }
    
    catch (error) {
        console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
}
};


// fetch a particular product from the store
const getProduct = async (req, res) => {
    try {
      
      
      console.log(req.params.id);
      const product = await productModel.findById(req.params.id).populate('category');
      console.log(product);
      if (!product) {
        res.status(404);
        throw new Error("No order found");
      }
      return res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  //update product in the store
  const updateProduct = async (req, res) => {
    try {
      if(!mongoose.isValidObjectId(req.params.id)){
        res.status(404);
        throw new Error("This is not a valid Product");
      }
      const updateProduct = await productModel.findById(req.params.id);
      if (!updateProduct) {
        res.status(404);
        throw new Error("No new order changes found");
      }
      const updatedProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  //count available products in stock
  const countProducts = async(req, res) =>{
    try {
      const countStock = await productModel.countDocuments();

    if(!countStock){
       res.status(404);
      throw new Error("Could not count Available products")
    }
      return res.status(200).json({message:`We have ${countStock} products available in stock`});
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: "Internal Server Error!"})
      
    }
  }

  //getting featured products
  const featuredProducts = async(req, res) =>{
    try {
      const countFeatured = await productModel.countDocuments({isFeatured:true});
      const count = req.params.count ? req.params.count : 0
      if(count > countFeatured){
        console.log('stand tall');
        return res.status(404).json({message: `You have only ${countFeatured} featured products`})
      }
    const products = await productModel.find({isFeatured: true}).limit(count);
    console.log('hello');
      if(!products || products.length === 0){
        res.status(404).json({message: 'Featured Products not found!'});
        // throw new Error('featured products not found!');
      }
      else{
      return res.status(200).json({products})}
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  
// delete products that are out of stock
  const deleteProduct = async(req, res) => {
    try {
      const removeProduct = await productModel.findById(req.params.id);
      if(!removeProduct){
        res.status(404)
        throw new Error('No new product found!');
      }
      else {
        const removedProduct = await productModel.findByIdAndDelete(req.params.id, req.body, { new: true });
        return res.status(200).json(removedProduct);
      }

    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const galleryImages = async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
      res.status(404);
      throw new Error("This is not a valid Product");
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath= `${req.protocol}://${req.get('host')}/public/uploads`;

    if(files){
      files.map(file => {
        imagesPaths.push(`${basePath}${file.fileName}`);
      })
    }


    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths
      },
      { new: true }
    );
    if (!updatedProduct) {
      res.status(404);
      throw new Error("No new changes found");
    }
    return res.status(200).json(updatedProduct);
  }


module.exports = {postProduct,uploadOptions, getProducts,getProduct,galleryImages, featuredProducts, deleteProduct, countProducts, updateProduct}
// module.exports = uploadOptions;