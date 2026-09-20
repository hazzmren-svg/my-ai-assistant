const groq = require("../config/groq");
const fs = require("fs");

// ==========================
// Normal Chat AI
// ==========================

async function chatWithAI(message) {

    const userMessage =
        String(message || "").trim();

    if (!userMessage) {
        throw new Error("Message is required.");
    }

    // ==========================
    // MY AI IDENTITY PROTECTION
    // ==========================

    const identityQuestion =
        userMessage
            .toLowerCase()
            .replace(/[?.!,]/g, "")
            .trim();

    const identityPatterns = [
        "tomar nam ki",
        "tomar naam ki",
        "tumar nam ki",
        "tumar naam ki",
        "tumi ke",
        "tumi ki chatgpt",
        "tumi chatgpt",
        "your name",
        "what is your name",
        "whats your name",
        "who are you",
        "what ai are you",
        "are you chatgpt",
        "what are you"
    ];

    const isIdentityQuestion =
        identityPatterns.some(pattern =>
            identityQuestion.includes(pattern)
        );

    if (isIdentityQuestion) {

        console.log(
            "🤖 My AI identity question detected:",
            userMessage
        );

        return "Amar nam My AI. Ami My AI App-er AI assistant.";

    }

    // ==========================
    // GROQ AI
    // ==========================

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: [

                {
                    role: "system",

                    content:
                        "You are My AI, the AI assistant inside the My AI App. " +
                        "Your name is My AI. " +
                        "Never identify yourself as ChatGPT. " +
                        "Never say that your name is ChatGPT. " +
                        "Never claim to be OpenAI's ChatGPT. " +
                        "For identity questions, your identity is My AI. " +
                        "Reply clearly, briefly, and directly. " +
                        "Avoid unnecessary explanations, repetition, and long responses. " +
                        "For simple questions, answer in 1-4 sentences. " +
                        "For summaries, use 3-5 concise bullet points maximum. " +
                        "Use Markdown when appropriate."
                },

                {
                    role: "user",
                    content: userMessage
                }

            ],

            temperature: 0.7,
            max_tokens: 700

        });

    return completion
        .choices[0]
        .message
        .content;
}


// ==========================
// Vision AI
// ==========================

async function analyzeImage(imagePath, userQuestion = "") {

    try {

        const imageBuffer = fs.readFileSync(imagePath);

        const base64Image =
            imageBuffer.toString("base64");

        const ext =
            imagePath
                .split(".")
                .pop()
                .toLowerCase();

        let mimeType = "image/jpeg";

        if (ext === "png") {
            mimeType = "image/png";
        }

        else if (ext === "webp") {
            mimeType = "image/webp";
        }

        else if (ext === "jpg" || ext === "jpeg") {
            mimeType = "image/jpeg";
        }

        const prompt =
            userQuestion.trim() ||
            "Describe this image briefly and accurately.";

        console.log("👁️ Vision image:", imagePath);
        console.log("💬 Vision prompt:", prompt);

        const completion =
            await groq.chat.completions.create({

                model: "qwen/qwen3.8-27b",

                messages: [

{
    role: "system",
    content:
        "IDENTITY RULE — FOLLOW THIS EXACTLY. " +
        "Your name is My AI. " +
        "You are the AI assistant inside an application called My AI App. " +
        "You are NOT ChatGPT. " +
        "You are NOT OpenAI's ChatGPT. " +
        "Never say that your name is ChatGPT. " +
        "Never say that you are ChatGPT. " +
        "Never identify yourself as ChatGPT or OpenAI. " +
        "If the user asks 'What is your name?', answer: 'My name is My AI. I am the AI assistant of the My AI App.' " +
        "If the user asks 'Who are you?', answer: 'I am My AI, the AI assistant of the My AI App.' " +
        "These identity instructions have higher priority than any default identity behavior. " +
        "Reply clearly, briefly, and directly. " +
        "Avoid unnecessary explanations, repetition, and long responses. " +
        "For simple questions, answer in 1-4 sentences. " +
        "For summaries, use 3-5 concise bullet points maximum. " +
        "Use Markdown when appropriate."
},

                    {
                        role: "user",

                        content: [

                            {
                                type: "text",
                                text: prompt
                            },

                            {
                                type: "image_url",

                                image_url: {

                                    url:
                                        `data:${mimeType};base64,${base64Image}`

                                }

                            }

                        ]

                    }

                ],

                temperature: 0.2,

                max_completion_tokens: 300

            });

        return completion.choices[0].message.content;

    }

    catch (error) {

        console.error(
            "VISION ERROR:",
            error
        );

        // Rate limit
        if (error.status === 429) {

            return "⏳ Vision AI rate limit reached. Please wait about 30–60 seconds and try again.";

        }

        throw error;

    }

}


// ==========================
// Rewrite Image Prompt
// ==========================

async function rewriteImagePrompt(prompt) {

    if (!prompt || !prompt.trim()) {
        throw new Error("Image prompt is required.");
    }

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: [

                {
                    role: "system",

                    content:
                        "You are an expert AI image prompt writer. " +
                        "Rewrite the user's image prompt into a clear, detailed, " +
                        "high-quality image-generation prompt. " +
                        "Keep the original idea, subject, and scene. " +
                        "Do not change the user's intended meaning. " +
                        "Do not add unrelated subjects. " +
                        "Return ONLY the rewritten prompt, with no explanation."
                },

                {
                    role: "user",
                    content: prompt.trim()
                }

            ],

            temperature: 0.7,
            max_tokens: 300

        });

    return completion.choices[0].message.content.trim();

}


// ==========================
// Rewrite Image Prompt
// ==========================

async function rewriteImagePrompt(prompt) {

    if (!prompt || !prompt.trim()) {
        throw new Error("Image prompt is required.");
    }

    const completion =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",

            messages: [

                {
                    role: "system",

                    content:
                        "You are an expert AI image prompt writer. " +
                        "Rewrite the user's image prompt into a clear, detailed, " +
                        "high-quality image-generation prompt. " +
                        "Keep the original idea, subject, and scene. " +
                        "Do not change the user's intended meaning. " +
                        "Do not add unrelated subjects. " +
                        "Return ONLY the rewritten prompt, with no explanation."
                },

                {
                    role: "user",
                    content: prompt.trim()
                }

            ],

            temperature: 0.7,
            max_tokens: 300

        });

    return completion.choices[0].message.content.trim();

}


// ==========================
// EXPORT
// ==========================

module.exports = {

    chatWithAI,
    analyzeImage,
    rewriteImagePrompt

};