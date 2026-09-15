// =========================
// Events.js - CLEAN VERSION
// =========================

// =========================
// File Input
// =========================

const fileInput =
    document.getElementById("fileInput");

// ==========================
// AI Voice Reply
// ==========================
// AI Text To Speech
// ==========================

function speakAIReply(text) {

    if (!text) {
        return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    // ==========================
    // Clean Markdown
    // ==========================

    const cleanText =
        text
            .replace(/[*_#`]/g, "")
            .replace(/\[(.*?)\]\(.*?\)/g, "$1")
            .replace(/https?:\/\/\S+/g, "")
            .trim();

    if (!cleanText) {
        return;
    }

    // ==========================
    // Detect Language
    // ==========================

    let language = "en-US";

    // Bengali
    if (/[\u0980-\u09FF]/.test(cleanText)) {

        language = "bn-BD";

    }

    // Hindi / Devanagari
    else if (/[\u0900-\u097F]/.test(cleanText)) {

        language = "hi-IN";

    }

    // English / Banglish / Latin
    else {

        language = "en-US";

    }

    console.log(
        "🔊 Detected language:",
        language
    );

    // ==========================
    // Get Voices
    // ==========================

    const voices =
        window.speechSynthesis.getVoices();

    console.log(
        "🔊 Available voices:",
        voices.length
    );

    // ==========================
    // Find Voice
    // ==========================

    let selectedVoice = null;

    // Hindi
    if (language === "hi-IN") {

        selectedVoice =
            voices.find(
                voice =>
                    voice.lang === "hi-IN"
            );

    }

    // Bengali
    else if (language === "bn-BD") {

        selectedVoice =
            voices.find(
                voice =>
                    voice.lang === "bn-BD"
            );

        if (!selectedVoice) {

            selectedVoice =
                voices.find(
                    voice =>
                        voice.lang === "bn-IN"
                );

        }

    }

    // English
    else {

        selectedVoice =
            voices.find(
                voice =>
                    voice.lang === "en-US"
            );

    }

    // ==========================
    // Log Selected Voice
    // ==========================

    if (selectedVoice) {

        console.log(
            "🔊 Selected voice:",
            selectedVoice.name,
            "|",
            selectedVoice.lang
        );

    }

    else {

        console.log(
            "⚠️ Requested voice not available:",
            language
        );

    }

    // ==========================
    // Create Speech
    // ==========================

    const utterance =
        new SpeechSynthesisUtterance(
            cleanText
        );

    utterance.lang =
        language;

    utterance.rate =
        1;

    utterance.pitch =
        1;

    utterance.volume =
        1;

    // Apply selected voice
    if (selectedVoice) {

        utterance.voice =
            selectedVoice;

    }

    // ==========================
    // Speech Events
    // ==========================

    utterance.onstart = () => {

        console.log(
            "🔊 AI voice started."
        );

    };

    utterance.onend = () => {

        console.log(
            "🔊 AI voice finished."
        );

    };

    utterance.onerror = (event) => {

        console.error(
            "❌ Speech error:",
            event.error
        );

    };

    // ==========================
    // Speak
    // ==========================

    window.speechSynthesis.speak(
        utterance
    );

}
// ==========================
// Voice Input
// ==========================

const voiceBtn =
    document.getElementById("voiceBtn");
    const pauseVoiceBtn =
document.getElementById("pauseVoiceBtn");
// ==========================
// AI Voice Pause / Resume
// ==========================

pauseVoiceBtn.addEventListener(
    "click",
    () => {

        // Pause
        if (
            window.speechSynthesis.speaking &&
            !window.speechSynthesis.paused
        ) {

            window.speechSynthesis.pause();

            pauseVoiceBtn.textContent = "▶️";

            pauseVoiceBtn.title =
                "Resume AI Voice";

            console.log(
                "⏸️ AI voice paused."
            );

        }

        // Resume
        else if (
            window.speechSynthesis.paused
        ) {

            window.speechSynthesis.resume();

            pauseVoiceBtn.textContent = "⏸️";

            pauseVoiceBtn.title =
                "Pause AI Voice";

            console.log(
                "▶️ AI voice resumed."
            );

        }

    }
);
const voiceLangBtn =
document.getElementById("voiceLangBtn");

let voiceLanguage = "bn-BD";

const stopVoiceBtn =
    document.getElementById("stopVoiceBtn");

    // ==========================
// Stop AI Voice
// ==========================

stopVoiceBtn.addEventListener(
    "click",
    function () {

        window.speechSynthesis.cancel();

        console.log(
            "⏹️ AI voice stopped."
        );

    }
);

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

   recognition.lang = voiceLanguage;

    recognition.continuous = false;

    recognition.interimResults = false;

voiceBtn.addEventListener(
    "click",
    () => {

        try {

            recognition.start();

            voiceBtn.textContent = "🔴";
            voiceBtn.title = "Listening...";

            console.log(
                "🎙️ Voice recognition started."
            );

        }

        catch (error) {

            console.error(
                "Voice start error:",
                error
            );

        }

    }
);

voiceLangBtn.addEventListener(
    "click",
    () => {

        if (voiceLanguage === "bn-BD") {

            voiceLanguage = "en-US";

            voiceLangBtn.textContent = "🇺🇸";

            console.log(
                "🎙️ Voice language: English"
            );

        } else {

            voiceLanguage = "bn-BD";

            voiceLangBtn.textContent = "🇧🇩";

            console.log(
                "🎙️ Voice language: বাংলা"
            );

        }

        if (recognition) {
            recognition.lang = voiceLanguage;
        }

    }
);

recognition.addEventListener(
    "result",
    async (event) => {
if (isSending) {
    return;
}
        const transcript =
            event.results[0][0].transcript.trim();

        if (!transcript) {
            return;
        }

        // Put voice text into textarea
        input.value = transcript;

        // Automatically send to AI
        await sendMessage();

    }
);

recognition.addEventListener(
    "end",
    () => {

        voiceBtn.textContent = "🎙️";

        voiceBtn.title =
            "Voice Input";

        console.log(
            "🎙️ Voice recognition ended."
        );

    }
);

recognition.addEventListener(
    "error",
    (event) => {

        console.error(
            "Voice Error:",
            event.error
        );

        voiceBtn.textContent = "🎙️";

        voiceBtn.title =
            "Voice Input";

    }
);

}
else {

    voiceBtn.disabled = true;

    voiceBtn.title =
        "Voice input is not supported in this browser.";

}
let selectedFile = null;
let currentDocumentId = null;
let isSending = false;

// =========================
// File Selected
// =========================

fileInput.addEventListener(
    "change",
    () => {

        if (!fileInput.files.length) {
            return;
        }

        selectedFile =
            fileInput.files[0];

        // Remove old preview
        const oldPreview =
            document.querySelector(
                ".file-preview"
            );

        if (oldPreview) {
            oldPreview.remove();
        }

        // Create preview
        const preview =
            document.createElement("div");

        preview.className =
            "file-preview";

        // =========================
        // Image Preview
        // =========================

        if (isImageFile(selectedFile)) {

            const image =
                document.createElement("img");

            image.src =
                URL.createObjectURL(
                    selectedFile
                );

            image.style.maxWidth =
                "150px";

            image.style.maxHeight =
                "100px";

            image.style.borderRadius =
                "8px";

            preview.appendChild(image);

            const name =
                document.createElement("span");

            name.textContent =
                " 🖼️ " +
                selectedFile.name;

            preview.appendChild(name);

        }

        // =========================
        // Document Preview
        // =========================

        else {

            preview.textContent =
                "📄 " +
                selectedFile.name;

        }

        document
            .querySelector(".input-area")
            .insertBefore(
                preview,
                input
            );

    }
);


// =========================
// Send Message
// =========================

async function sendMessage() {

    // =========================
    // Prevent duplicate requests
    // =========================

    if (isSending) {

        console.log(
            "⚠️ Request already running. Ignoring duplicate."
        );

        return;

    }

    const message =
        input.value.trim();

    // =========================
    // Nothing to send
    // =========================

    if (
        !message &&
        !selectedFile &&
        !currentDocumentId
    ) {

        return;

    }

    // =========================
    // Lock sending
    // =========================

    isSending = true;

    // =========================
    // User Message
    // =========================

    let userText = message;

    if (!userText && selectedFile) {

        userText =
            `📄 ${selectedFile.name}`;

    }

    if (!userText) {

        userText =
            "Please analyze the document.";

    }

    const userBox =
        createMessage("user");

    userBox
        .querySelector(".bubble")
        .textContent =
        userText;

    addMessageToConversation(
        "user",
        userText
    );

    renderConversationList();

    // Clear input
    input.value = "";

    // Disable send
    send.disabled = true;

    // Typing
    showTyping();

    try {

        let reply = "";

        // =================================================
        // 1. IMAGE
        // =================================================

        if (
            selectedFile &&
            isImageFile(selectedFile)
        ) {

            console.log(
                "🖼️ Image selected:",
                selectedFile.name
            );

            reply =
                await analyzeImage(
                    selectedFile,
                    message
                );

        }

        // =================================================
        // 2. DOCUMENT
        // =================================================

        else if (
            selectedFile &&
            isDocumentFile(selectedFile)
        ) {

            console.log(
                "📄 Document selected:",
                selectedFile.name
            );

            // -----------------------------------------
            // Upload document ONLY ONCE
            // -----------------------------------------

            const uploadResult =
                await uploadFile(
                    selectedFile
                );

            console.log(
                "📥 Upload result:",
                uploadResult
            );

            if (
                !uploadResult.success
            ) {

                throw new Error(
                    uploadResult.error ||
                    "Document upload failed."
                );

            }

            // Save document ID
            currentDocumentId =
                uploadResult.documentId;

            if (!currentDocumentId) {

                throw new Error(
                    "Document ID was not returned by the server."
                );

            }

            console.log(
                "💾 Document ID:",
                currentDocumentId
            );

            // -----------------------------------------
            // Ask document AI
            // -----------------------------------------

            const question =
                message ||
                "Summarize this document.";

            const documentResponse =
                await fetch(
                    "/chat/document",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                documentId:
                                    currentDocumentId,

                                question:
                                    question

                            })

                    }
                );

            const data =
                await documentResponse.json();

            if (!documentResponse.ok) {

                throw new Error(
                    data.reply ||
                    data.error ||
                    "Document analysis failed."
                );

            }

            reply =
                data.reply ||
                "No document response.";

        }

        // =================================================
        // 3. NORMAL CHAT
        // =================================================

        else {

            reply =
                await askAI(
                    message
                );

        }

        // =========================
        // Remove Typing
        // =========================

        removeTyping();

        // =========================
        // AI Message
        // =========================

        const aiBox =
            createMessage("ai");

        const markdown =
            aiBox.querySelector(
                ".markdown"
            );

        // =========================
        // Stream Response
        // =========================

        await streamText(
            markdown,
            reply
        );
        speakAIReply(reply);
        // =========================
        // Copy Button
        // =========================

        const copyBtn =
            aiBox.querySelector(
                ".copy-btn"
            );

        if (copyBtn) {

            copyBtn.onclick =
                async () => {

                    try {

                        await navigator
                            .clipboard
                            .writeText(
                                reply
                            );

                        copyBtn.innerHTML =
                            "✅ Copied";

                        setTimeout(
                            () => {

                                copyBtn.innerHTML =
                                    "📋 Copy";

                            },
                            1500
                        );

                    }

                    catch (copyError) {

                        console.error(
                            "COPY ERROR:",
                            copyError
                        );

                    }

                };

        }

        // =========================
        // Save AI Message
        // =========================

        addMessageToConversation(
            "ai",
            reply
        );

        renderConversationList();

    }

    catch (error) {

        console.error(
            "❌ SEND MESSAGE ERROR:",
            error
        );

        removeTyping();

        // =========================
        // Error Message
        // =========================

        const aiBox =
            createMessage("ai");

        const markdown =
            aiBox.querySelector(
                ".markdown"
            );

        let errorMessage =
            "❌ Something went wrong.";

        const errorText =
            error.message || "";

        // Rate limit
        if (
            errorText.includes("429") ||
            errorText
                .toLowerCase()
                .includes("rate limit")
        ) {

            errorMessage =
                "⏳ AI rate limit reached. Please wait a little and try again.";

        }

        else {

            errorMessage =
                "❌ **Error:** " +
                errorText;

        }

        markdown.innerHTML =
            marked.parse(
                errorMessage
            );

        // Save error message
        addMessageToConversation(
            "ai",
            errorMessage
        );

    }

    finally {

    // Allow next request
    isSending = false;

        // =========================
        // Reset File
        // =========================

        selectedFile = null;

        fileInput.value = "";

        const preview =
            document.querySelector(
                ".file-preview"
            );

        if (preview) {
            preview.remove();
        }

        // Enable send
        send.disabled = false;

    }

}


// =========================
// Send Button
// =========================

send.addEventListener(
    "click",
    sendMessage
);


// =========================
// Enter Key
// =========================

input.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    }
);