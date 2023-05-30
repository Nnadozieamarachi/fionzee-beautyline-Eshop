const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''    
    },
    images: [{
        type:String
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true 
    },
    size: {
        type: String,
        default: ''
    },
    countInStock: { 
        type : Number,
        required: true,
        min: 0,
        max: 1000
},
rating: {
    type: Number,
    default:0,
    min: 0,
    max: 10
},
numReviews:{
    type: Number,
    default: 0
},
isFeatured: {
    type: Boolean,
    default: true,
},
dateCreated: {
    type: Date,
    default: Date.now,
},
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true, 
})

module.exports = mongoose.model("Product", productSchema); 