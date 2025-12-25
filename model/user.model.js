const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    user_name: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                let rgx = new RegExp(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)
                return rgx.test(v)
            },
            message: (props) => `${props.value} is Not a valid Name`
        },
        required: [true, "User Name is Required"]
    },
    email: {
        type: String,
        trim: true,
        default: ""
    },
    gender: {
        type: String,
        trim: true,
        required: [true, "Gender is Required"],
        enum: {
            values: ['male', 'female', 'other'], message: function (props) {
                return props.value + " is Not Valid Gender"
            }
        },
    },
    password: {
        type: String,
        trim: true,
        required: [true, "password must be required"]
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0])?[6789]\d{9}$/.test(v)
            },
            message: (props) => `${props.value} is Not A valid Mobile Number`
        },
        required: [true, "Mobile Number Is Required"],
        unique: true
    },
    address: {
        type: String,
        trim: true
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    profile: {
        type: String,
        trim: true
    }

}, { timestamps: true });

const userModel = model("users", userSchema);

module.exports = userModel;