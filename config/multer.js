const multer = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let format = file.fieldname
        switch (format) {
            case "profile": (() => {
                let isDir = fs.existsSync("uploads/images/avatar");

                if (!isDir) {
                    fs.mkdirSync("uploads/images/avatar", { recursive: true });
                }

                cb(null, "uploads/images/avatar")
            })();
                break;
            case "recipes": (() => {
                let isDir = fs.existsSync(`uploads/images/recipes/temp_file`);

                if (!isDir) {
                    fs.mkdirSync(`uploads/images/recipes/temp_file`, { recursive: true });
                }

                cb(null, `uploads/images/recipes/temp_file`)

            })()
                break;
            default: cb("Only videos or Image file Are Allowed", false)
        }
    },
    filename: (req, file, cb) => {
        let format = file.fieldname
        switch (format) {
            case "profile": cb(null, req.user.user_name + "-" + Date.now() + "." + file.mimetype.split("/")[1])
                break;
            case "recipes": cb(null, "recipe" + "-" + Date.now() + "." + file.mimetype.split("/")[1])
        }

    }
});

function fileFilter(req, file, cb) {
    let format = file.mimetype.split("/")[0];
    switch (format) {
        case "image": cb(null, true);
            break;
        case "video": cb(null, true);
            break;
        default: cb("Only Text or Image file Are Allowed", false)
    }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 100 } });

module.exports = upload;