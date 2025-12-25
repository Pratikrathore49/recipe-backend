const { Schema, model } = require('mongoose');

const recipeSchema = new Schema({
    recipe_name: {
        type: String,
        required: [true, "recipe name is mandatory"],
        unique: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "user details require"],
        ref: "users"
    },
    ingredients: {
        type: String,
        required: [true, "ingredients is mandatory"],
        trim: true
    },
    cooking_time: {
        type: String,
        required: [true, "cooking time is mandatory"],
        trim: true
    },
    images: {
        type: [String]
    },
    thumbnail: {
        type: String,
        required: [true, "thumbnail is mandatory"],
        trim: true
    },
    instructions: {
        type: String,
        required: [true, "instructions is mandatory"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "category is mandatory"],
        enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Salad"]
    },
    recipe_cuisine: {
        type: String,
        required: [true, "recipe_cuisine is mandatory"],
    },
    making_video: {
        type: String,
        trim: true
    },
    is_veg: {
        type: String,
        required: [true, "Is Veg is mandatory"],
        enum: ["yes", "no"]
    }
}, { timestamps: true });

module.exports = model("recipes", recipeSchema);