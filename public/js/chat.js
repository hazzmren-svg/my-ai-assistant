const express = require("express");
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

// ==========================
// TEXT TO IMAGE
// ==========================

router.post(
    "/image",
    async (req, res) => {

        try {

            const prompt =
                req.body?.prompt?.trim();

            if (!prompt) {

                return res.status(400).json({
                    success: false,
                    error: "Image prompt is required."
                });

            }

            console.log(
                "🎨 Image generation request:",
                prompt
            );

            const result =
                await generateImage(prompt);

            return res.status(200).json({

                success: true,

                prompt:
                    result.prompt || prompt,

                imageUrl:
                    result.imageUrl

            });

        }

        catch (error) {

            console.error(
                "IMAGE ROUTE ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Image generation failed."

            });

        }

    }
);

const router = express.Router();

const upload = multer({
    dest: path.join(__dirname, "../uploads")
});


// ==========================
// NORMAL CHAT
// ==========================

router.post("/", async (req, res) => {

    try {

        const message = req.body?.message;

        if (!message) {

            return res.status(400).json({
                reply: "Message is required."
            });

        }

        const reply =
            await chatWithAI(message);

        res.json({
            reply
        });

    }

    catch (err) {

        console.error(
            "CHAT ERROR:",
            err
        );

        res.status(500).json({
            reply: "Chat AI Error"
        });

    }

});


// ==========================
// VISION
// ==========================

router.post(
    "/vision",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    reply: "No image uploaded."
                });

            }

            const question =
                req.body.question || "";

            const reply =
                await analyzeImage(
                    req.file.path,
                    question
                );

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.json({
                reply
            });

        }

        catch (err) {

            console.error(
                "VISION ROUTE ERROR:",
                err
            );

            if (
                req.file &&
                fs.existsSync(req.file.path)
            ) {
                fs.unlinkSync(req.file.path);
            }

            res.status(500).json({
                reply:
                    err.message ||
                    "Vision AI Error"
            });

        }

    }
);

// ==========================
// Rewrite Image Prompt
// ==========================

router.post(
    "/rewrite-prompt",
    async (req, res) => {

        try {

            const prompt =
                req.body?.prompt?.trim();

            if (!prompt) {

                return res.status(400).json({
                    success: false,
                    error: "Image prompt is required."
                });

            }

            console.log(
                "✏️ Rewriting image prompt:",
                prompt
            );

            const rewrittenPrompt =
                await rewriteImagePrompt(prompt);

            return res.json({

                success: true,

                originalPrompt: prompt,

                rewrittenPrompt

            });

        }

        catch (error) {

            console.error(
                "PROMPT REWRITE ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Failed to rewrite image prompt."

            });

        }

    }
);
module.exports = router;