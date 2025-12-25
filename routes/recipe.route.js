const express = require('express');
const { userMiddleware } = require('../middleware/auth.middleware');
const upload = require('../config/multer');
const { getAllRecipes, addRecipe, editRecipe, deleteRecipe, updateRecipeThumbnail, getAllRecipesByUser, singleRecipe } = require('../controller/recipe.controller');
const router = express.Router();

router.get("/", getAllRecipes);
router.post("/add-recipe", userMiddleware, upload.single("recipes"), addRecipe);
router.patch("/edit/:id", userMiddleware, editRecipe);
router.delete("/delete/:id", userMiddleware, deleteRecipe);
router.patch("/update-thumbnail/:recipe_id", userMiddleware, upload.single("recipes"), updateRecipeThumbnail);
router.get("/added-by-user",userMiddleware, getAllRecipesByUser);
router.get("/rc/:recipe_id", singleRecipe)

module.exports = router;
