const express = require('express');
const { getAllUsers, registerUser, editUser, deleteUser, deleteFromTrash, getTrashUsers, restoreUser, loginUser, getUserProfile, uploadProfile } = require('../controller/user.controller');
const { userMiddleware } = require('../middleware/auth.middleware');
const upload = require('../config/multer');
const { ErrorResponse, SuccessResponse } = require('../apiResponse/response');
const router = express.Router();

router.get("/", userMiddleware, getAllUsers);
router.get("/trash-users", userMiddleware, getTrashUsers)
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/log-out", userMiddleware, (req, res) => {
    try {
        res.clearCookie("login_token");
        res.json(new SuccessResponse(null, "Logged Out Success"))
    } catch (error) {
        res.json(new ErrorResponse(error, error.message))
    }
})
router.patch("/edit", userMiddleware, editUser)
router.delete("/delete/:id", userMiddleware, deleteUser)
router.delete("/delete-from-trash/:id", deleteFromTrash)
router.get("/restore/:id", restoreUser)
router.get("/profile", userMiddleware, getUserProfile)
router.post("/upload", userMiddleware, upload.single("profile"), uploadProfile)

module.exports = router;
