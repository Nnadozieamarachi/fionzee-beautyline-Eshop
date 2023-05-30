const express = require('express');
const {getUser, currentUser,countUsers, getUsers, registerUser,loginUser, updateUser, deleteUser}= require("../userControllers");
const validateToken = require('../middleware/validateTokenHandler');

const router = express.Router();


router.get("/:id", getUser);
router.post("/loginUser", loginUser);
router.get("/", getUsers);
router.post("/registerUser",registerUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/currentUser",validateToken, currentUser);

module.exports = router;