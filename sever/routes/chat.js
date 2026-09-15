const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    chatWithAI,
    analyzeImage,
    rewriteImagePrompt
} = require("../services/aiService");

const {
    generateImage
} = require("../services/imageService");

const {
    getDocument
} = require("../services/documentService");

// ==========================
// Upload Folder
// ==========================

const uploadFolder = path.join(
    __dirname,
    "../uploads"
);

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {
        recursive: true
    });
}

// ==========================
// Multer
// ==========================

const upload = multer({
    dest: uploadFolder,

    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

// ==========================
// Normal Chat
// ==========================

router.post("/", async (req, res) => {

    try {

        const message =
            req.body?.message?.trim();

        if (!message) {

            return res.status(400).json({
                reply: "Message is required."
            });

        }

        const reply =
            await chatWithAI(message);

        return res.json({
            success: true,
            reply
        });

    }

    catch (err) {

        console.error(
            "CHAT ERROR:",
            err
        );

        return res.status(500).json({
            success: false,
            reply: "Internal Server Error"
        });

    }

});

// ==========================
// Vision AI
// ==========================

router.post(
    "/vision",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    error: "No image uploaded."
                });

            }

            const question =
                req.body?.question?.trim() ||
                "Describe this image briefly and accurately.";

            console.log(
                "👁️ Vision image:",
                req.file.originalname
            );

            const reply =
                await analyzeImage(
                    req.file.path,
                    question
                );

            return res.json({
                success: true,
                reply
            });

        }

        catch (err) {

            console.error(
                "VISION ERROR:",
                err
            );

            return res.status(500).json({
                success: false,
                error: err.message
            });

        }

        finally {

            if (
                req.file &&
                fs.existsSync(req.file.path)
            ) {

                try {
                    fs.unlinkSync(req.file.path);
                }
                catch (deleteError) {
                    console.error(
                        "TEMP IMAGE DELETE ERROR:",
                        deleteError
                    );
                }

            }

        }

    }
);

// ========================================
// Chat With Document
// ========================================

router.post(
    "/document",
    async (req, res) => {

        try {

            const documentId =
                req.body?.documentId;

            const question =
                req.body?.question?.trim();

            // ----------------------------
            // Validate
            // ----------------------------

            if (!documentId) {

                return res.status(400).json({
                    success: false,
                    reply: "Document ID is required."
                });

            }

            if (!question) {

                return res.status(400).json({
                    success: false,
                    reply:
                        "Please ask a question about the document."
                });

            }

            // ----------------------------
            // Get Document
            // ----------------------------

            const document =
                getDocument(documentId);

            if (!document) {

                return res.status(404).json({
                    success: false,
                    reply:
                        "Document not found. Please upload the document again."
                });

            }

            console.log(
                "📄 Document:",
                document.filename
            );

            console.log(
                "❓ Question:",
                question
            );

            // ----------------------------
            // Check content
            // ----------------------------

            if (
                !document.content ||
                !document.content.trim()
            ) {

                return res.status(400).json({
                    success: false,
                    reply:
                        "Could not extract text from this document."
                });

            }

            // ----------------------------
            // Limit document size
            // ----------------------------

            const maxCharacters = 30000;

            let documentText =
                document.content;

            if (
                documentText.length >
                maxCharacters
            ) {

                documentText =
                    documentText.substring(
                        0,
                        maxCharacters
                    ) +
                    "\n\n[Document truncated due to length.]";

            }

            // ----------------------------
            // AI Prompt
            // ----------------------------

            const prompt = `
You are a professional document analysis AI.

Answer the user's question using ONLY the document content provided below.

Rules:
- Do not invent information.
- Do not use outside information.
- If the requested information is not available in the document, say:
"I couldn't find that information in the document."
- For a summary, summarize the actual document content.
- Keep the answer clear and well organized.
- Use Markdown when useful.

DOCUMENT NAME:
${document.filename}

DOCUMENT CONTENT:
${documentText}

USER QUESTION:
${question}
`;

            // ----------------------------
            // Ask AI
            // ----------------------------

            const reply =
                await chatWithAI(prompt);

            // ----------------------------
            // Response
            // ----------------------------

            return res.json({

                success: true,

                reply,

                documentId,

                filename:
                    document.filename

            });

        }

        catch (err) {

            console.error(
                "DOCUMENT CHAT ERROR:",
                err
            );

            return res.status(500).json({

                success: false,

                reply:
                    "Failed to analyze the document.",

                error:
                    err.message

            });

        }

    }
);

// ==========================
// Rewrite Image Prompt
// ==========================

router.post("/rewrite-prompt", async (req, res) => {

    try {

        const prompt =
            req.body?.prompt?.trim();

        if (!prompt) {

            return res.status(400).json({
                success: false,
                error: "Prompt is required."
            });

        }

        console.log(
            "✏️ Rewrite prompt:",
            prompt
        );

        const rewrittenPrompt =
            await rewriteImagePrompt(prompt);

        return res.json({

            success: true,

            rewrittenPrompt

        });

    }

    catch (error) {

        console.error(
            "REWRITE PROMPT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                error.message ||
                "Failed to rewrite prompt."

        });

    }

});

// ==========================
// Text To Image
// ==========================

router.post("/image", async (req, res) => {
    try {
        const prompt = req.body?.prompt;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                error: "Image prompt is required."
            });
        }

        console.log("🎨 Image prompt:", prompt);

        const result = await generateImage(prompt);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error("IMAGE GENERATION ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message || "Image generation failed."
        });
    }
});
module.exports = router;

// ==========================
// Export
// ==========================
