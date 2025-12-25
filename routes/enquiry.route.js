const express = require('express');
const { userMiddleware } = require('../middleware/auth.middleware');
const { getAllEnquiries, sendEnquiry, deleteEnquiry, responseOnEnquiry } = require('../controller/enquiry.controller');
const router = express.Router();

router.get("/", getAllEnquiries);
router.post("/send-enquiry", sendEnquiry);
router.delete("/delete/:enquiry_id", deleteEnquiry);
router.post("/response/:enquiry_id", userMiddleware, responseOnEnquiry)

module.exports = router;
