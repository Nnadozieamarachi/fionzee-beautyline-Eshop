const categoryModel = require("./models/categoryModels");


const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find(req.params);
    console.log(categories);
    return res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const postCategory = async (req, res) => {
  try {
    console.log("here");
    console.log("request body is: ", req.body);
    const { name, icon, color } = req.body;
    if (!name || !icon || !color) {
      res.status(400);
       throw new Error("All fields are mandatory!");
    }
    else{
      // const Category = new Category({
      //   icon: req.body.icon,
      //   name: req.body.name,
      //   color: req.body.color
      // })
      // Category = await categoryModel.create();
      const newCategory = await categoryModel.create({
        icon,
        name,
        color,
      });
      console.log('hii');
      console.log(newCategory);

    return res.status(201).json(newCategory);
  }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategory = async (req, res) => {
  try {
    console.log(req.params.id);
    const category = await categoryModel.findById(req.params.id);
    console.log(category);
    if (!category) {
      res.status(404);
      throw new Error("No category found");
    }
    return res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updateCategory = await categoryModel.findById(req.params.id);
    if (!updateCategory) {
      res.status(404);
      throw new Error("No new category changes found");
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const removeOrder = await categoryModel.findById(req.params.id);
    if (!removeOrder) {
      res.status(404);
      throw new Error("No category found");
    } else {
      const removedOrder = await categoryModel.findByIdAndDelete(req.params.id, req.body, { new: true });
      return res.status(200).json(removeOrder);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getCategories, postCategory, getCategory, updateCategory
, deleteCategory };

