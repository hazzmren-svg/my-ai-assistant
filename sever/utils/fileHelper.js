const fs = require("fs");

function deleteFile(filePath) {

    if (fs.existsSync(filePath)) {

        fs.unlinkSync(filePath);

    }

}

module.exports = {
    deleteFile
};