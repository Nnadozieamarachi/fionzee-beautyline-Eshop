// const asyncHandler = require("express-async-handler");
const userModels = require("./models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();


const getUsers = async (req, res) => {
    try {
      const userlist = await userModels.find().select('-password');
      console.log(userlist);
      return res.status(200).json(userlist);
    } catch (error) {
      // Exception handling for getUsers
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };
  
  const registerUser = async (req, res) => {
    try {
      console.log('request body is :', req.body);
      const { email, username, password,phone, isAdmin, apartment, zip, city, country } = req.body;
      if (!email || !username || !password) {
        throw new Error('All fields are mandatory!');
      }
      const userAvailable = await userModels.findOne({ email });
      if (userAvailable) {
        console.log('User already registered!');
        return res.status(400).json({message:'User is already Registered!'})
      }else{
        const hashedPassword = await bcrypt.hash(password, 10);
      console.log('hashedPassword:', hashedPassword);
  
      const createdUser = await userModels.create({
        username,
        email,
        password: hashedPassword,
        phone,
        isAdmin,
        apartment,
        zip,
        city,
        country,
      });
      console.log(`userModels created ${createdUser}`);
  
      if (createdUser) {
        return res.status(201).json({ _id: createdUser.id, email: createdUser.email });
      } else {
        return next(new Error('Failed to create user'));
      }
      }
      
    } catch (error) {
      // Exception handling for registerUser
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };

  const loginUser= async(req, res) =>{
    try {
      const {email, password} = req.body;
      if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
      }
      //check if the userModels email has been registered and then compare the email and password.
      const user = await userModels.findOne({email});
      if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign(
          {
          user:{
            // username: user.username,
            // email:  user.email,
            id: user.id,
            isAdmin: user.isAdmin

            },
            
          }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"}
          );
          res.status(200).json(accessToken)
        }
          else{
            console.error("Email or Password is not Valid!");
          }
      }catch (error) {
      console.error(error);
      return res.status(500).json({error: error})
      
    }
  }  
  
  const getUser = async (req, res) => {
    try {
      console.log(req.params.id);
      const user = userModels.findById(req.params.id).select('-password');
      if (!user) {
        throw new Error('No user found!');
      }
      return res.status(200).json(user);
    } catch (error) {
      // Exception handling for getUser
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };

  //current userModels endpoint
const currentUser = async(req, res) => {
  res.json(req.userModels)
}

  const updateUser = async (req, res) => {
    try {
      const updateContact = userModels.findById(req.params.id);
      if (!updateContact) {
        res.status(404);
        throw new Error('No new userModels info found');
      }
      const updatedContact = userModels.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json(updatedContact);
    } catch (error) {
      // Exception handling for updateUser
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };

  const countUsers = async(req, res) =>{
    try {
      const countUsers = await userModels.countDocuments();

    if(!countUsers){
       res.status(404);
      throw new Error("Could not count the number of users")
    }
      return res.status(200).json({message:`We have ${countUsers} users on our web shop`});
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: "Internal Server Error!"})
      
    }
  }
  
  const deleteUser = async (req, res) => {
    try {
      const removeUser = userModels.findById(req.params.id);
      if (!removeUser) {
        res.status(404);
        throw new Error('User not found');
      }
      const removedUser = userModels.findByIdAndDelete(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json(removedUser);
    } catch (error) {
      // Exception handling for deleteUser
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };
  


module.exports = {getUser,countUsers, currentUser, getUsers,loginUser, updateUser, deleteUser, registerUser};