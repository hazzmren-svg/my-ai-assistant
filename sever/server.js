console.log("🔥 AI Server Starting...");

require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const mammoth = require("mammoth");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const { createCanvas } = require("canvas");
// PDF OCR Dependencies
// ==========================
const os = require("os");
let pdfjsLib = null;

async function getPDFJS() {

    if (!pdfjsLib) {

        pdfjsLib =
            await import(
                "pdfjs-dist/legacy/build/pdf.mjs"
            );

    }

    return pdfjsLib;
}
// ==========================
// Scanned PDF OCR
// ==========================

async function extractTextFromScannedPDF(pdfPath) {

    console.log(
        "🔍 Scanned PDF detected. Starting OCR..."
    );

    try {

        // Read PDF as Uint8Array
        const pdfBuffer =
            new Uint8Array(
                fs.readFileSync(pdfPath)
            );

        // Load PDF.js
        const pdfjs =
            await getPDFJS();

        // Open PDF
        const pdfDocument =
            await pdfjs.getDocument({
                data: pdfBuffer
            }).promise;

        const totalPages =
            pdfDocument.numPages;

        console.log(
            `📄 PDF Pages: ${totalPages}`
        );

        // OCR maximum 20 pages
        const maxOCRPages = 20;

        const pagesToProcess =
            Math.min(
                totalPages,
                maxOCRPages
            );

        console.log(
            `🔍 OCR will process ${pagesToProcess} page(s).`
        );

let fullText = "";

for (
    let pageNumber = 1;
    pageNumber <= pagesToProcess;
    pageNumber++
) {

    console.log(
        `🖼️ Rendering page ${pageNumber}/${pagesToProcess}...`
    );

    try {

        const page =
            await pdfDocument.getPage(
                pageNumber
            );

        const scale = 2;

        const viewport =
            page.getViewport({
                scale
            });

        const width =
            Math.ceil(
                viewport.width
            );

        const height =
            Math.ceil(
                viewport.height
            );

        console.log(
            `📐 Page size: ${width} x ${height}`
        );

        const canvas =
            createCanvas(
                width,
                height
            );

        const context =
            canvas.getContext("2d");

        await page.render({

            canvasContext:
                context,

            viewport:
                viewport

        }).promise;

        console.log(
            `✅ Page ${pageNumber} rendered successfully`
        );

        const pngBuffer =
            canvas.toBuffer(
                "image/png"
            );

        console.log(
            `🖼️ PNG created: ${pngBuffer.length} bytes`
        );

    }

    catch (pageError) {

        console.error(
            `❌ Page ${pageNumber} render failed:`,
            pageError.message
        );

    }

}

return fullText.trim();

    }

    catch (error) {

        console.error(
            "❌ Scanned PDF OCR failed:",
            error.message
        );

        return "";

    }

}

const {
    saveDocument
} = require("./services/documentService");

const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");
const app = express();
// ==========================
// Serve Generated Images
// ==========================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);
const PORT = process.env.PORT || 3000;

// ==========================
// Middleware
// ==========================

app.use(express.json({
    limit: "20mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}));

// ==========================
// Chat Route
// ==========================

app.use("/chat", chatRoute);

// ==========================
// Authentication Route
// ==========================

app.use(
    "/api/auth",
    authRoute
);

// ==========================
// Static Files
// ==========================

app.use(express.static(
    path.join(__dirname, "../public")
));

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../../public/index.html"
        )
    );

});

// ==========================
// Upload Folder
// ==========================

const uploadFolder = path.join(
    __dirname,
    "../uploads"
);

if (!fs.existsSync(uploadFolder)) {

    fs.mkdirSync(
        uploadFolder,
        {
            recursive: true
        }
    );

}
// ==========================
// Serve Uploaded & Generated Images
// ==========================

app.use(
    "/uploads",
    express.static(uploadFolder)
);
// ==========================
// Multer
// ==========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            uploadFolder
        );

    },

    filename: (req, file, cb) => {

        const safeName =
            Date.now() +
            "-" +
            file.originalname
                .replace(/[^a-zA-Z0-9._-]/g, "_");

        cb(
            null,
            safeName
        );

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize:
            20 * 1024 * 1024

    },

    fileFilter: (req, file, cb) => {

        const allowed = [

            ".txt",
            ".pdf",
            ".docx",

            ".jpg",
            ".jpeg",
            ".png",
            ".webp"

        ];

        const ext =
            path
                .extname(file.originalname)
                .toLowerCase();

        if (allowed.includes(ext)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Unsupported file type."
                )
            );

        }

    }

});

// ==========================
// Upload Route
// ==========================

app.post(
    "/upload",
    upload.single("file"),
    async (req, res) => {

        try {

            // --------------------------
            // Check File
            // --------------------------

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "No file uploaded."

                });

            }

            const filePath =
                req.file.path;

            const originalName =
                req.file.originalname;

            const ext =
                path
                    .extname(originalName)
                    .toLowerCase();

            console.log(
                "📁 File received:",
                originalName
            );

            let content = "";

            // ==========================
            // TXT
            // ==========================

            if (ext === ".txt") {

                console.log(
                    "📄 Reading TXT..."
                );

                content =
                    fs.readFileSync(
                        filePath,
                        "utf8"
                    );

            }

// ==========================
          // PDF
// ==========================

else if (ext === ".pdf") {

    console.log(
        "📕 Reading PDF..."
    );

    const buffer =
        fs.readFileSync(
            filePath
        );

    // --------------------------
    // First: Normal PDF Text
    // Extraction
    // --------------------------

    try {

        const pdfData =
            await pdfParse(
                buffer
            );

        content =
            pdfData.text || "";

        content =
            content.trim();

        console.log(
            "📝 Extracted PDF text:",
            content.length,
            "characters"
        );

    }

    catch (pdfError) {

        console.error(
            "⚠️ PDF text extraction failed:",
            pdfError.message
        );

        content = "";

    }


    // --------------------------
    // OCR FALLBACK
    // --------------------------

    if (!content) {

        console.log(
            "⚠️ No readable PDF text found."
        );

        console.log(
            "🔍 Switching to scanned PDF OCR..."
        );

        try {

            content =
                await extractTextFromScannedPDF(
                    filePath
                );

            content =
                content.trim();

            console.log(
                "📝 OCR extracted:",
                content.length,
                "characters"
            );

        }

        catch (ocrError) {

            console.error(
                "❌ Scanned PDF OCR failed:",
                ocrError
            );

            content = "";

        }

    }

}

            // ==========================
            // DOCX
            // ==========================

            else if (ext === ".docx") {

                console.log(
                    "📘 Reading DOCX..."
                );

                const result =
                    await mammoth.extractRawText({

                        path: filePath

                    });

                content =
                    result.value || "";

            }

            // ==========================
            // IMAGE + OCR
            // ==========================

            else if (

                ext === ".jpg" ||
                ext === ".jpeg" ||
                ext === ".png" ||
                ext === ".webp"

            ) {

                console.log(
                    "🖼️ Image received:",
                    originalName
                );

                console.log(
                    "🔍 Starting OCR..."
                );

                const result =
                    await Tesseract.recognize(

                        filePath,

                        "eng",

                        {

                            logger: info => {

                                if (
                                    info.status ===
                                    "recognizing text"
                                ) {

                                    console.log(

                                        "OCR Progress:",
                                        Math.round(
                                            info.progress *
                                            100
                                        ) + "%"

                                    );

                                }

                            }

                        }

                    );

                const ocrText =
                    result.data.text
                        .trim();

                console.log(
                    "✅ OCR completed"
                );

                // Delete temporary image
                if (
                    fs.existsSync(
                        filePath
                    )
                ) {

                    fs.unlinkSync(
                        filePath
                    );

                }

                return res.json({

                    success: true,

                    type: "image",

                    filename:
                        originalName,

                    content:
                        ocrText,

                    ocr: true

                });

            }

            // ==========================
            // Unsupported
            // ==========================

            else {

                if (
                    fs.existsSync(
                        filePath
                    )
                ) {

                    fs.unlinkSync(
                        filePath
                    );

                }

                return res.status(400).json({

                    success: false,

                    error:
                        "Unsupported file type."

                });

            }

            // ==========================
            // Check Extracted Text
            // ==========================

            content =
                content.trim();

            if (!content) {

                if (
                    fs.existsSync(
                        filePath
                    )
                ) {

                    fs.unlinkSync(
                        filePath
                    );

                }

                return res.status(400).json({

                    success: false,

                    error:
                        "No readable text found in this document."

                });

            }

            // ==========================
            // Create Document ID
            // ==========================

            const documentId =
                Date.now().toString();

            // ==========================
            // Save Document
            // ==========================

            saveDocument(

                documentId,

                originalName,

                content

            );

            console.log(
                "💾 Document saved:",
                documentId
            );

            // ==========================
            // Delete Temporary File
            // ==========================

            if (
                fs.existsSync(
                    filePath
                )
            ) {

                fs.unlinkSync(
                    filePath
                );

            }

            // ==========================
            // Response
            // ==========================

            return res.json({

                success: true,

                type: "document",

                documentId,

                filename:
                    originalName,

                message:
                    "Document uploaded successfully."

            });

        }

        catch (err) {

            console.error(
                "UPLOAD ERROR:",
                err
            );

            if (
                req.file &&
                fs.existsSync(
                    req.file.path
                )
            ) {

                fs.unlinkSync(
                    req.file.path
                );

            }

            return res.status(500).json({

                success: false,

                error:
                    err.message

            });

        }

    }
);

// ==========================
// Multer Error Handler
// ==========================

app.use(
    (err, req, res, next) => {

        if (
            err instanceof multer.MulterError
        ) {

            return res.status(400).json({

                success: false,

                error:
                    err.message

            });

        }

        if (err) {

            console.error(
                "SERVER ERROR:",
                err
            );

            return res.status(400).json({

                success: false,

                error:
                    err.message

            });

        }

        next();

    }
);

// ==========================
// Start Server
// ==========================

app.listen(
    PORT,
    () => {

        console.log(
            "================================="
        );

        console.log(
            "🚀 AI Server Running Successfully"
        );

        console.log(
            `🌐 http://localhost:${PORT}`
        );

        console.log(
            "================================="
        );

    }
);