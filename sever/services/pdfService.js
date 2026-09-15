const fs = require("fs");
const pdfParse = require("pdf-parse");

async function readPDF(filePath) {

    const buffer = fs.readFileSync(filePath);

    const pdf = await pdfParse(buffer);

    return pdf.text;

}

module.exports = {
    readPDF
};