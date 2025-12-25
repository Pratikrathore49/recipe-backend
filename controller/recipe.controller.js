const { ErrorResponse, SuccessResponse } = require("../apiResponse/response");
const RecipeModel = require("../model/recipe.model");
const fs = require('fs');
const userModel = require("../model/user.model");

async function getAllRecipes(req, res) {

    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let skip = (page - 1) * limit

    try {
        let data = await RecipeModel.find().populate("user").limit(limit).skip(skip);
        const countNum = await RecipeModel.countDocuments();
        if (!data) return res.json(new ErrorResponse(null, "failed"));
        return res.json(new SuccessResponse({ page, limit, total_recipe: countNum, recipes: data }, "success"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function addRecipe(req, res) {

    const { filename, destination } = req.file
    const recipeName = req.body.recipe_name?.replaceAll(" ", "-")

    try {
        fs.mkdirSync(`uploads/images/recipes/${recipeName}`, { recursive: true })
        fs.copyFileSync(`${destination}/${filename}`, `uploads/images/recipes/${recipeName}/${filename.replace("recipe", recipeName)}`)
        fs.rmSync(`${destination}/${filename}`, { recursive: true, force: true });

        const url = `${req.protocol}://${req.host}/download/images/recipes/${recipeName}/${filename.replace("recipe", recipeName)}`
        let response = await RecipeModel.create({ ...req.body, user: req.user.id, thumbnail: url });
        if (!response) return res.json(new ErrorResponse(null, "adding recipe failed"));
        response = response.toObject()
        response.user = await userModel.findById(req.user.id);
        return res.json(new SuccessResponse(response, "recipe added successfully"));
    } catch (error) {
        return res.json(new ErrorResponse(error, "failed"));
    }
}

async function editRecipe(req, res) {
    const { id } = req.params;
    const { category, ingredients, instructions, recipe_cuisine, cooking_time } = req.body
    try {
        let response = await RecipeModel.findByIdAndUpdate(id, { category, ingredients, instructions, recipe_cuisine, cooking_time }, { new: true });
        if (!response) return res.json({ status: false, message: "Updating failed" })
        return res.json({ status: true, data: response, message: "Updated successfully" })
    } catch (error) {
        res.json({ status: false, message: error.message })
    }
}

async function deleteRecipe(req, res) {
    const { id } = req.params;
    try {
        let response = await RecipeModel.findByIdAndDelete(id);
        if (!response) return res.json({ status: false, message: "Delete Opration failed" })

        if (fs.existsSync(`uploads/images/recipes/${response.recipe_name}`)) {
            fs.rmSync(`uploads/images/recipes/${response.recipe_name}`, { recursive: true, force: true })
        }

        return res.json({ status: true, data: response, message: "Deleted successfully" })
    } catch (error) {
        res.json({ status: false, message: error.message })
    }
}

async function getAllRecipesByUser(req, res) {
    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let skip = (page - 1) * limit
    try {
        let data = await RecipeModel.find({ user: req.user.id }).populate('user').limit(limit).skip(skip);;
        if (!data) return res.json(new ErrorResponse(null, "No Recipes Are Found"))
        const countNum = await RecipeModel.countDocuments({ user: req.user.id });
         return res.json(new SuccessResponse({ page, limit, total_recipe: countNum, recipes: data }, "success"));
    } catch (error) {
        res.json(new ErrorResponse(error, error.message))
    }
}

async function singleRecipe(req, res) {
    const { recipe_id } = req.params;
    try {
        let data = await RecipeModel.findById(recipe_id).populate('user');
        if (!data) return res.json(new ErrorResponse(null, "No Recipes Are Found"))
        return res.json(new SuccessResponse(data, "Success"))
    } catch (error) {
        res.json(new ErrorResponse(error, error.message))
    }
}

async function updateRecipeThumbnail(req, res) {
    const { recipe_id } = req.params;
    const { filename, destination } = req.file

    try {

        let recipe = await RecipeModel.findById(recipe_id);

        if (!recipe) return res.json(new ErrorResponse(null, "Recipe Not Found"));

        // procees new thumbnail
        fs.copyFileSync(`${destination}/${filename}`, `uploads/images/recipes/${recipe.recipe_name}/${filename.replace("recipe", recipe.recipe_name)}`)
        // delete temp file 
        fs.rmSync(`${destination}/${filename}`, { recursive: true, force: true });

        // make a new thumbnail url
        const url = `${req.protocol}://${req.host}/download/images/recipes/${recipe.recipe_name}/${filename.replace("recipe", recipe.recipe_name)}`

        let response = await RecipeModel.findByIdAndUpdate(recipe_id, { thumbnail: url }, { new: true });
        if (!response) return res.json(new ErrorResponse(null, "Uploading Failed"));
        response = response.toObject();

        if (response.thumbnail) {
            // delete old thumbnail
            let thumbPath = recipe.thumbnail.slice(recipe.thumbnail.lastIndexOf("/"))
            fs.rmSync(`uploads/images/recipes/${recipe.recipe_name}/${thumbPath}`);
        }
        return res.json(new SuccessResponse(response, "Thumbnail Uploaded Successfully"))
    } catch (error) {
        res.json({ status: false, message: error.message })
    }
}

module.exports = {
    getAllRecipes,
    getAllRecipesByUser,
    singleRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe,
    updateRecipeThumbnail
}