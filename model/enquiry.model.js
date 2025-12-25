const { Schema, model } = require("mongoose");

const enquirySchema = new Schema({
    applicant_name: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                let rgx = new RegExp(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)
                return rgx.test(v)
            },
            message: (props) => `${props.value} is Not a valid Name`
        },
        required: [true, "applicant Name is Required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "applicant Email is Required"]
    },
    message: {
        type: String,
        trim: true,
        required: [true, "applicant Message is Required"]
    },
    response_msg: {
        type: [String],
        trim: true
    }

}, { timestamps: true });

const enquiryModel = model("enquiry", enquirySchema);

module.exports = enquiryModel;