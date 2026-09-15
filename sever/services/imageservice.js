const { InferenceClient } = require("@huggingface/inference");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const hf = new InferenceClient(process.env.HF_TOKEN);

console.log(
    "HF TOKEN CHECK:",
    process.env.HF_TOKEN
        ? `Loaded (${process.env.HF_TOKEN.length} characters)`
        : "NOT LOADED"
);


// ==========================
// TEXT TO IMAGE
// ==========================

async function generateImage(prompt) {

    if (!prompt || !prompt.trim()) {
        throw new Error("Image prompt is required.");
    }

    const finalPrompt = prompt.trim();

    console.log("🎨 Image prompt:", finalPrompt);

    console.log("🤗 Sending image request to Hugging Face...");


    // ==========================
    // Generate Image
    // ==========================

    const imageBlob = await hf.textToImage({

        model: "black-forest-labs/FLUX.1-schnell",

        inputs: finalPrompt,

        provider: "auto"

    });


    // ==========================
    // Convert Blob → Buffer
    // ==========================

    const originalBuffer =
        Buffer.from(
            await imageBlob.arrayBuffer()
        );


    console.log(
        "📦 Image received:",
        Math.round(originalBuffer.length / 1024),
        "KB"
    );


    // ==========================
    // Generated Image Folder
    // ==========================

    const uploadDir =
        path.join(
            __dirname,
            "../uploads/generated"
        );


    if (!fs.existsSync(uploadDir)) {

        fs.mkdirSync(
            uploadDir,
            {
                recursive: true
            }
        );

    }


    // ==========================
    // Always Convert to REAL PNG
    // ==========================

    const filename =
        `image-${Date.now()}.png`;

    const filePath =
        path.join(
            uploadDir,
            filename
        );


    await sharp(originalBuffer)
        .png()
        .toFile(filePath);


    // ==========================
    // Verify Image
    // ==========================

    const metadata =
        await sharp(filePath).metadata();


    console.log(
        "🖼️ Image format:",
        metadata.format
    );

    console.log(
        "📐 Image size:",
        `${metadata.width}x${metadata.height}`
    );


    console.log(
        "✅ Image generated successfully:",
        filename
    );

    console.log(
        "📁 Saved:",
        filePath
    );


    return {

        success: true,

        prompt: finalPrompt,

        imageUrl:
            `/uploads/generated/${filename}`

    };

}


module.exports = {

    generateImage

};