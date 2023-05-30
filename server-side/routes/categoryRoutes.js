const express = require("express");
const { getCategories, getCategory, postCategory, updateCategory,deleteCategory } = require("../categoryControllers");
const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);
router.post('/', postCategory);

module.exports = router;