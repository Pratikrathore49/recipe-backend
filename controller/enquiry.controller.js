const { ErrorResponse, SuccessResponse } = require("../apiResponse/response");
const EnquiryModel = require("../model/enquiry.model");
const transporter = require("../services/nodemailer");

async function getAllEnquiries(req, res) {

    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let skip = (page - 1) * limit

    try {
        let data = await EnquiryModel.find().limit(limit).skip(skip);
        const countNum = await EnquiryModel.countDocuments();
        if (!data) return res.json(new ErrorResponse(null, "failed"));
        return res.json(new SuccessResponse({ page, limit, total_enquiries: countNum, enquiries: data }, "success"));
    } catch (error) {
        res.json(new ErrorResponse(error, "failed"));
    }
}

async function sendEnquiry(req, res) {
    try {
        let response = await EnquiryModel.create({ ...req.body });
        if (!response) return res.json(new ErrorResponse(null, "sending failed"));
        response = response.toObject()
        return res.json(new SuccessResponse(response, "enquiry sent successfully"));
    } catch (error) {
        return res.json(new ErrorResponse(error, "failed"));
    }
}

async function deleteEnquiry(req, res) {
    const { enquiry_id } = req.params;
    try {
        let response = await EnquiryModel.findByIdAndDelete(enquiry_id);
        if (!response) return res.json(new ErrorResponse(null, "Delete Opration failed"))

        return res.json(new SuccessResponse(response, "Deleted successfully"))
    } catch (error) {
        res.json(new ErrorResponse(error, error.message))
    }
}

async function responseOnEnquiry(req, res) {
    const { enquiry_id } = req.params;
    const { response_msg } = req.body;
    try {
        let data = await EnquiryModel.findByIdAndUpdate(enquiry_id, { response_msg: [response_msg] }, { new: true })
        if (!data) return res.json(new ErrorResponse(null, "No Recipes Are Found"));

        var message = {
            from: "krishnaptl43@gmail.com",
            to: data.email,
            subject: "Response From Our Team",
            html: `<!DOCTYPE html>
                   <html>
                     <head>
                      <meta charset="utf-8" />
                      <title>Thank You</title>
                     </head>
                     <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
                       <table align="center" width="600" style="background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                        <tr>
                          <td style="text-align: center;">
                          <h2 style="color: #2563eb;">Thank You!</h2>
                           <p style="font-size: 16px; color: #374151;">
                            Dear <strong>${data.applicant_name}</strong>,  
                           </p>
                           <p style="font-size: 16px; color: #374151; line-height: 1.5;">
                           We truly appreciate your support and trust in us.  
                           Your contribution means a lot, and we look forward to serving you again.
                           ${response_msg}  
                           </p>
                           <p style="margin-top: 20px;">
                            <a href="https://yourwebsite.com" style="background: #2563eb; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px;">Visit Us Again</a>
                           </p>
                          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
                          <p style="font-size: 14px; color: #6b7280;">
                           © 2025 Your Company. All rights reserved.
                          </p>
                         </td>
                        </tr>
                      </table>
                      </body>
                   </html>`,
        };

        transporter.sendMail(message, (err) => {
            if (err) {
                return res.json(new ErrorResponse(err, err.message))
            }
            return res.json(new SuccessResponse(data, "Success"))
        });

    } catch (error) {
        res.json(new ErrorResponse(error, error.message))
    }
}

module.exports = {
    getAllEnquiries,
    sendEnquiry,
    deleteEnquiry,
    responseOnEnquiry
}