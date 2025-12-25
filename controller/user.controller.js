const { ErrorResponse, SuccessResponse } = require("../apiResponse/response");
const { passEncrypt, passMatch } = require("../config/bcrypt");
const { generateToken } = require("../config/jwtToken");
const userModel = require("../model/user.model");
const fs = require('fs')

async function getAllUsers(req, res) {

    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let skip = (page - 1) * limit

    try {
        let data = await userModel.find({ isDelete: false }).limit(limit).skip(skip);
        const countNum = await userModel.countDocuments({ isDelete: false });
        if (!data) return res.json(new ErrorResponse(null, "failed"))
        return res.json(new SuccessResponse({ page, limit, total_users: countNum, users: data }, "success"))
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"))
    }
}

async function registerUser(req, res) {
    const { password, ...rest } = req.body
    try {

        let hashPass = await passEncrypt(password)
        let response = await userModel.create({ ...rest, password: hashPass });
        if (!response) return res.json(new ErrorResponse(null, "registration failed"))
        return res.json(new SuccessResponse(response, "registration successfully"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function editUser(req, res) {
    const { user_name, email, address, gender } = req.body
    try {
        let response = await userModel.findByIdAndUpdate(req.user.id, { user_name, email, address, gender }, { new: true });
        if (!response) return res.json(new ErrorResponse(error, "Updating failed"));
        return res.json(new SuccessResponse(response, "Updated successfully"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        let response = await userModel.findByIdAndUpdate(id, { isDelete: true }, { new: true });
        if (!response) return res.json(new ErrorResponse(null, "Delete Opration failed"))
        return res.json(new SuccessResponse(response, "Deleted successfully"))
    } catch (error) {
        res.json(new ErrorResponse(error.message, "error"));
    }
}

async function deleteFromTrash(req, res) {
    const { id } = req.params;
    try {
        let response = await userModel.findByIdAndDelete(id);
        if (!response) return res.json(new ErrorResponse(null, "Delete Opration failed"));
        return res.json(new SuccessResponse(response, "Deleted From trash successfully"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function getTrashUsers(req, res) {

    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let skip = (page - 1) * limit

    try {
        let data = await userModel.find({ isDelete: true }).limit(limit).skip(skip);
        const countNum = await userModel.countDocuments({ isDelete: true });
        if (!data) return res.json(new ErrorResponse(null, "failed"));
        data.total_users = countNum
        return res.json(new SuccessResponse(data, "success"))
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function restoreUser(req, res) {
    const { id } = req.params;
    try {
        let response = await userModel.findByIdAndUpdate(id, { isDelete: false }, { new: true });
        if (!response) return res.json(new ErrorResponse(null, "restore Opration failed"));
        return res.json(new SuccessResponse(response, "restore successfully"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function loginUser(req, res) {
    const { mobile, password } = req.body;
    try {
        let user = await userModel.findOne({ mobile, isDelete: false });
        if (!user) {
            return res.json(new ErrorResponse(null, "User Not Found"));
        }
        let match = await passMatch(user.password, password)
        if (!match) {
            return res.json(new ErrorResponse(null, "Incorrect Password"));
        }

        let token = generateToken({ id: user._id, user_name: user.user_name });

        res.cookie("login_token", token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            // secure : true,
        })

        return res.json(new SuccessResponse(user, "Login Success !"))

    } catch (error) {
        return res.json(new ErrorResponse(error, "failed"));
    }
}

async function getUserProfile(req, res) {
    try {
        let data = await userModel.findOne({ _id: req.user.id, isDelete: false })
        return res.json(new SuccessResponse(data, "success"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function uploadProfile(req, res) {

    const { filename, destination } = req.file
    const url = `${req.protocol}://${req.host}/${destination.replace("uploads", "download")}/${filename}`

    try {
        let response = await userModel.findByIdAndUpdate(req.user.id, { profile: url });
        if (!response) return res.json(new ErrorResponse(null, "Updating failed"));
        response = response.toObject();

        if (response.profile) {
            let index = response.profile.lastIndexOf("/");
            let str = response.profile.slice(index)
            fs.rmSync(`${destination}/${str}`)
        }
        return res.json(new SuccessResponse({ ...response, profile: url }, "Updated successfully"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

module.exports = {
    getAllUsers,
    registerUser,
    deleteFromTrash,
    deleteUser,
    editUser,
    getTrashUsers,
    restoreUser,
    loginUser,
    getUserProfile,
    uploadProfile
}