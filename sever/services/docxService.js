const mammoth = require("mammoth");

async function readDOCX(filePath) {

    const result = await mammoth.extractRawText({
        path: filePath
    });

    return result.value;

}

module.exports = {
    readDOCX
};