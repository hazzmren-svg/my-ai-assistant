// =========================
// API Configuration
// =========================

const API_BASE = "https://my-ai-assistant-humk.onrender.com";

const API = {

    chat: `${API_BASE}/chat`,
    upload: `${API_BASE}/upload`,
    vision: `${API_BASE}/chat/vision`

};


// =========================
// Normal Chat AI
// =========================

async function askAI(message) {

    try {

        const response = await fetch(API.chat, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.reply ||
                data.error ||
                `Server Error: ${response.status}`
            );

        }

        return data.reply || "No response";

    }

    catch (error) {

        console.error("API Error:", error);

        throw error;

    }

}


// =========================
// Upload PDF / DOCX / TXT
// =========================

async function uploadFile(file) {

    try {

        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(API.upload, {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.reply ||
                `Upload failed: ${response.status}`
            );

        }

        return data;

    }

    catch (error) {

        console.error("Upload API Error:", error);

        throw error;

    }

}


// =========================
// Compress Image
// =========================

async function compressImage(file) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        const reader = new FileReader();

        reader.onload = (event) => {

            img.src = event.target.result;

        };

        reader.onerror = () => {

            reject(
                new Error("Could not read image.")
            );

        };

        img.onload = () => {

            const maxSize = 1280;

            let width = img.width;
            let height = img.height;


            // Resize image
            if (width > maxSize || height > maxSize) {

                if (width > height) {

                    height =
                        height *
                        (maxSize / width);

                    width = maxSize;

                }

                else {

                    width =
                        width *
                        (maxSize / height);

                    height = maxSize;

                }

            }


            // Canvas
            const canvas =
                document.createElement("canvas");

            canvas.width =
                Math.round(width);

            canvas.height =
                Math.round(height);


            const ctx =
                canvas.getContext("2d");

            if (!ctx) {

                reject(
                    new Error(
                        "Could not create image canvas."
                    )
                );

                return;

            }


            ctx.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );


            // Convert to JPEG
            canvas.toBlob(

                (blob) => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Image compression failed."
                            )
                        );

                        return;

                    }


                    const compressedFile =
                        new File(

                            [blob],

                            "vision-image.jpg",

                            {
                                type: "image/jpeg"
                            }

                        );


                    resolve(
                        compressedFile
                    );

                },

                "image/jpeg",

                0.75

            );

        };


        img.onerror = () => {

            reject(
                new Error(
                    "Invalid image file."
                )
            );

        };


        reader.readAsDataURL(file);

    });

}


// =========================
// Vision AI
// =========================

async function analyzeImage(file, question) {

    try {

        console.log(
            "👁️ Sending image to Vision AI:",
            file.name
        );


        // Compress image
        const compressedImage =
            await compressImage(file);


        console.log(
            "📦 Original size:",
            Math.round(
                file.size / 1024
            ),
            "KB"
        );


        console.log(
            "📦 Compressed size:",
            Math.round(
                compressedImage.size / 1024
            ),
            "KB"
        );


        // FormData
        const formData =
            new FormData();


        formData.append(
            "image",
            compressedImage
        );


        formData.append(
            "question",

            question &&
            question.trim()

                ? question.trim()

                : "Describe this image briefly and accurately."
        );


        // Send to Vision route
        const response =
            await fetch(
                API.vision,
                {

                    method: "POST",

                    body: formData

                }
            );


        // Read response
        const data =
            await response.json();


        // Error
        if (!response.ok) {

            throw new Error(

                data.reply ||
                data.error ||
                `Vision request failed: ${response.status}`

            );

        }


        console.log(
            "👁️ Vision response:",
            data
        );


        return data.reply || "No vision response";


    }

    catch (error) {

        console.error(
            "VISION API ERROR:",
            error
        );

        throw error;

    }

}


// =========================
// Detect Image File
// =========================

function isImageFile(file) {

    if (!file) {
        return false;
    }

    const imageTypes = [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ];

    return imageTypes.includes(
        file.type
    );

}


// =========================
// Detect Document File
// =========================

function isDocumentFile(file) {

    if (!file) {
        return false;
    }

    const name =
        file.name.toLowerCase();

    return (

        name.endsWith(".pdf") ||
        name.endsWith(".doc") ||
        name.endsWith(".docx") ||
        name.endsWith(".txt")

    );

}
// =========================
// Chat With Document
// =========================

async function askDocumentAI(
    documentId,
    question
) {

    const response =
        await fetch(
            `${API_BASE}/chat/document`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    documentId,

                    question

                })

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(

            data.reply ||
            data.error ||
            "Document AI request failed."

        );

    }


    return data.reply;

}
async function generateImage(prompt) {
    try {
        const response = await fetch(`${API_BASE}/chat/image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt.trim()
            })
        });

        // First read as text so HTML errors don't cause
        // "Unexpected token '<'"
        const raw = await response.text();

        console.log("IMAGE API STATUS:", response.status);
        console.log("IMAGE API RESPONSE:", raw);

        let data;

        try {
            data = JSON.parse(raw);
        } catch (parseError) {
            throw new Error(
                `Server returned invalid JSON. Status: ${response.status}`
            );
        }

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.reply ||
                "Image generation failed."
            );
        }

        return data;

    } catch (error) {
        console.error("IMAGE API ERROR:", error);
        throw error;
    }
}
// =========================
// Rewrite Image Prompt
// =========================

async function rewriteImagePrompt(prompt) {

    try {

        const response = await fetch(
            `${API_BASE}/chat/rewrite-prompt`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    prompt: prompt.trim()
                })
            }
        );

        // Read as text first
        const raw = await response.text();

        console.log(
            "REWRITE API STATUS:",
            response.status
        );

        console.log(
            "REWRITE API RESPONSE:",
            raw
        );

        let data;

        try {
            data = JSON.parse(raw);
        }

        catch (error) {

            throw new Error(
                `Rewrite API returned invalid JSON. Status: ${response.status}`
            );

        }

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.reply ||
                "Failed to rewrite prompt."
            );

        }

        return data;

    }

    catch (error) {

        console.error(
            "REWRITE PROMPT API ERROR:",
            error
        );

        throw error;

    }

}