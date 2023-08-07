require('dotenv').config()
const express = require('express');
const cors = require('cors');
const productRoute = require('./routes/productRoutes');
const orderRoute = require('./routes/orderRoutes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorHandler');
const authJwt = require('./helpers/jwt');
 
//  dotenv.config();

const app = express();
app.use(cors());
// app.use(expressjwt);
app.options('*', cors());

//creating a port
const port = process.env.PORT || 5001
// const port =  5001;

const mongodbURI = process.env.CONNECTION_STRING;
// const mongodbURI = "mongodb+srv://fiona:Bacteriaa3@fiona-web-cluster.oqsffcw.mongodb.net/test?retryWrites=true&w=majority;"; 

async function connect(){
    try{
        await mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true}) 
    console.log('successfully connected to the data base');
        
    //listen to port 
    app.listen(port,() =>{
        console.log(`server running on port ${port}`);
    })
} catch(error){
    console.error(error);
}

}

//creating APIs
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/order", orderRoute);
app.use("/api/products", productRoute);
app.use(errorHandler);


connect();