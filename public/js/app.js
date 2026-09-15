// ============================================================
// MY AI ASSISTANT - APP.JS
// ============================================================


// ============================================================
// APP START
// ============================================================

window.addEventListener("DOMContentLoaded", function () {

let projectsOpen = true;

// ==========================
// Text To Image
// ==========================

const imageBtn = document.getElementById("imageBtn");

if (imageBtn) {
    imageBtn.addEventListener("click", async () => {

        const prompt = input.value.trim();

        if (!prompt) {
            alert("Please enter an image description first.");
            input.focus();
            return;
        }

        try {
            imageBtn.disabled = true;
            imageBtn.textContent = "⏳";

            // Show user's prompt
            const userMessage = createMessage("user");
            userMessage.querySelector(".bubble").textContent = prompt;

            input.value = "";

            // Loading message
            showTyping();

            // Generate image
            addMessageToConversation("user", prompt);
            const result = await generateImage(prompt);

            removeTyping();

            if (!result.success || !result.imageUrl) {
                throw new Error(
                    result.error || "Image generation failed."
                );
            }

const finalPrompt =
    result.prompt || prompt;

// Save user prompt
addMessageToConversation(
    "user",
    finalPrompt
);

// Save generated image
addMessageToConversation(
    "image",
    finalPrompt,
    result.imageUrl
);

// Show generated image
showGeneratedImage(
    result.imageUrl,
    finalPrompt
);
addMessageToConversation(
    "ai",
    result.prompt || prompt,
    result.imageUrl
);

        } catch (error) {

            removeTyping();

            console.error("IMAGE GENERATION ERROR:", error);

            const errorMessage = createMessage("ai");

            const markdown =
                errorMessage.querySelector(".markdown");

            markdown.innerHTML =
                `❌ ${error.message || "Image generation failed."}`;

        } finally {

            imageBtn.disabled = false;
            imageBtn.textContent = "🖼️";
        }
    });

// =========================
// RENDER PROJECTS
// =========================

function renderProjects() {

    const projectsList =
        document.getElementById("projectsList");

    const allChatsBtn =
        document.getElementById("allChatsBtn");

    if (!projectsList) return;

    // Show / Hide Projects
    projectsList.style.display =
        projectsOpen ? "block" : "none";

    if (allChatsBtn) {
        if (currentProjectId === null) {
            allChatsBtn.classList.add("active");
        } else {
            allChatsBtn.classList.remove("active");
        }
    }

    projectsList.innerHTML = "";


    projects.forEach(function (project) {

        const projectItem =
            document.createElement("div");

        projectItem.className =
            "project-item";


        if (
            project.id === currentProjectId
        ) {

            projectItem.classList.add(
                "active"
            );

        }


       projectItem.innerHTML = `

    <div class="project-name">
        📁 ${project.name}
    </div>

    <div class="project-actions">

        <button
            type="button"
            class="project-new-chat"
            title="New Chat in this Project">
            ＋
        </button>

        <button
            type="button"
            class="project-rename"
            title="Rename Project">
            ✏️
        </button>

        <button
            type="button"
            class="project-delete"
            title="Delete Project">
            🗑️
        </button>

    </div>

`;

// =========================
// OPEN PROJECT
// =========================

const projectNameElement =
    projectItem.querySelector(".project-name");

if (projectNameElement) {
    projectNameElement.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();

            // Select this Project
            currentProjectId = project.id;

            // Do not automatically open a chat
            currentChatId = null;

            // Save selected Project
            saveProjects();

            // Update Project UI
            renderProjects();

            // Show Project chat history
            renderConversationList();

            // Clear current chat area
            if (chat) {
                chat.innerHTML = "";
            }
        }
    );
}

// =========================
// Rename Project
// =========================

const renameProjectBtn =
    projectItem.querySelector(".project-rename");

if (renameProjectBtn) {

    renameProjectBtn.onclick =
        function (event) {

            event.stopPropagation();

            const newName =
                prompt(
                    "Enter new project name:",
                    project.name
                );

            if (!newName || !newName.trim()) {
                return;
            }

            project.name =
                newName.trim();

            saveProjects();

            renderProjects();

        };

}


// =========================
// Delete Project
// =========================

const deleteProjectBtn =
    projectItem.querySelector(".project-delete");

if (deleteProjectBtn) {

    deleteProjectBtn.onclick =
        function (event) {

            event.stopPropagation();

            const confirmed =
                window.confirm(
                    `Delete project "${project.name}"?`
                );

            if (!confirmed) {
                return;
            }

            deleteProject(project.id);

            renderProjects();

            renderConversationList();

            if (currentChatId) {
                loadCurrentConversation();
            } else if (chat) {
                chat.innerHTML = "";
            }

        };

}

        // =========================
        // New Chat Inside Project
        // =========================

        const newChatBtn =
            projectItem.querySelector(
                ".project-new-chat"
            );

        newChatBtn.onclick =
            function (event) {

                event.stopPropagation();


                // Select this Project
                currentProjectId =
                    project.id;


                // Create new Chat
                const newConversation =
                    createConversation();


                if (newConversation) {

                    addChatToProject(
                        newConversation.id
                    );

                }


                // Update UI
                renderProjects();

                renderConversationList();

                loadCurrentConversation();

            };


        projectsList.appendChild(
            projectItem
        );

    });

}

}

    // ========================================================
    // CURRENT USER
    // ========================================================

    let currentUser = null;

    const savedUser =
        localStorage.getItem("currentUser");

    if (savedUser) {

        try {

            currentUser =
                JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "CURRENT USER ERROR:",
                error
            );

            localStorage.removeItem("currentUser");

        }

    }


    // ========================================================
    // UI ELEMENTS
    // ========================================================

    const chat =
        document.getElementById("chat");

    const input =
        document.getElementById("message");

    const send =
        document.getElementById("send");

    const newChat =
        document.getElementById("newChat");

    const historyBox =
        document.getElementById("history");


    // ========================================================
    // PROFILE ELEMENTS
    // ========================================================

    const profileBtn =
        document.getElementById("profileBtn");

    const profileMenu =
        document.getElementById("profileMenu");

    const profileArrow =
        document.getElementById("profileArrow");

    const userName =
        document.getElementById("userName");

    const userEmail =
        document.getElementById("userEmail");

    const settingsBtn =
        document.getElementById("settingsBtn");

    const appearanceBtn =
        document.getElementById("appearanceBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // ========================================================
    // SHOW USER INFORMATION
    // ========================================================

    if (currentUser) {

        if (userName) {

            userName.textContent =
                currentUser.name || "User";

        }

        if (userEmail) {

            userEmail.textContent =
                currentUser.email || "";

        }

    }


    // ========================================================
    // CONVERSATION START
    // ========================================================
    
    loadProjects();
    loadConversations();

    if (conversations.length === 0) {

        createConversation();

    }

    if (!currentChatId && conversations.length > 0) {

        currentChatId =
            conversations[0].id;

    }

    renderConversationList();

    loadCurrentConversation();


    // ========================================================
    // PROFILE DROPDOWN
    // ========================================================

    if (profileBtn && profileMenu) {

        profileBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const opened =
                    profileMenu.classList.contains("show");


                if (opened) {

                    profileMenu.classList.remove("show");

                    if (profileArrow) {

                        profileArrow.textContent =
                            "▴";

                    }

                } else {

                    profileMenu.classList.add("show");

                    if (profileArrow) {

                        profileArrow.textContent =
                            "▾";

                    }

                }

            }
        );

    }


    // ========================================================
    // SETTINGS
    // ========================================================

    if (settingsBtn) {

        settingsBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                window.location.href =
                    "/settings.html";

            }
        );

    }


    // ========================================================
    // APPEARANCE
    // ========================================================

    if (appearanceBtn) {

        appearanceBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                document.body.classList.toggle(
                    "light-mode"
                );

            }
        );

    }


    // ========================================================
    // LOGOUT
    // ========================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const confirmLogout =
                    window.confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {

                    return;

                }


                // Remove login session
                localStorage.removeItem(
                    "currentUser"
                );


                // Go to login
                window.location.replace(
                    "/login.html"
                );

            }
        );

    }


    // ========================================================
    // CLOSE PROFILE MENU
    // WHEN CLICKING OUTSIDE
    // ========================================================

    document.addEventListener(
        "click",
        function (event) {

            if (!profileMenu || !profileBtn) {

                return;

            }


            if (
                !profileMenu.contains(event.target) &&
                !profileBtn.contains(event.target)
            ) {

                profileMenu.classList.remove(
                    "show"
                );


                if (profileArrow) {

                    profileArrow.textContent =
                        "▴";

                }

            }

        }
    );


    // ========================================================
    // SEND BUTTON
    // ========================================================

    if (send) {

        send.addEventListener(
            "click",
            function () {

                if (
                    typeof sendMessage ===
                    "function"
                ) {

                    sendMessage();

                }

            }
        );

    }


    // ========================================================
    // ENTER KEY
    // ========================================================

    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();


                    if (
                        typeof sendMessage ===
                        "function"
                    ) {

                        sendMessage();

                    }

                }

            }
        );

    }


    // ========================================================
    // NEW CHAT
    // ========================================================

    if (newChat) {

        newChat.addEventListener(
            "click",
            function () {

                const newConversation =
                    createConversation();

                // If a Project is selected,
                // create the chat inside that Project
                if (
                    currentProjectId &&
                    newConversation
                ) {

                    addChatToProject(
                        newConversation.id
                    );

                }

                if (chat) {

                    chat.innerHTML = "";

                }

                renderProjects();

                renderConversationList();

                loadCurrentConversation();

            }
        );

    }

// =========================
// PROJECTS TOGGLE
// =========================

const projectsHeader =
    document.querySelector(".projects-header");

if (projectsHeader) {
    projectsHeader.addEventListener(
        "click",
        function (event) {

            // Plus button click করলে toggle হবে না
            if (
                event.target.closest("#newProjectBtn")
            ) {
                return;
            }

            projectsOpen = !projectsOpen;

            renderProjects();
            renderConversationList();
        }
    );
}

// =========================
// NEW PROJECT
// =========================

const newProjectBtn =
    document.getElementById("newProjectBtn");

if (newProjectBtn) {

    newProjectBtn.addEventListener(
        "click",
        function () {

            const name =
                prompt("Enter Project Name:");

            if (!name || !name.trim()) {
                return;
            }

            const project =
                createProject(name);

            if (!project) {
                return;
            }

            renderProjects();

        }
    );

}

// =========================
// ALL CHATS BUTTON
// =========================

const allChatsBtn =
    document.getElementById("allChatsBtn");

if (allChatsBtn) {

    allChatsBtn.addEventListener(
        "click",
        function () {

            // Exit current project
            currentProjectId = null;

            // Save project state
            saveProjects();

            // Update Project UI
            renderProjects();

            // Show all conversations
            renderConversationList();

            // Load current chat
            if (currentChatId) {
                loadCurrentConversation();
            }

            // Active button
            allChatsBtn.classList.add("active");

        }
    );

}

});


// ============================================================
// AI TEXT TO SPEECH
// ============================================================

window.speakAIReply =
    function (text) {

        if (!text) {

            return;

        }


        if (
            !window.speechSynthesis
        ) {

            return;

        }


        // Stop previous voice
        window.speechSynthesis.cancel();


        // Remove markdown
        const cleanText =
            text

                .replace(/[*_#`]/g, "")

                .replace(
                    /\[([^\]]+)\]\([^)]+\)/g,
                    "$1"
                )

                .replace(
                    /https?:\/\/\S+/g,
                    ""
                )

                .trim();


        if (!cleanText) {

            return;

        }


        const utterance =
            new SpeechSynthesisUtterance(
                cleanText
            );


        // Voice language
        if (
            typeof voiceLanguage !==
            "undefined" &&
            voiceLanguage === "bn-BD"
        ) {

            utterance.lang =
                "bn-BD";

        } else {

            utterance.lang =
                "en-US";

        }


        utterance.rate = 1;

        utterance.pitch = 1;

        utterance.volume = 1;


        window.speechSynthesis.speak(
            utterance
        );

    };
    // ============================================================
// GENERATED IMAGE UI
// ============================================================

function showGeneratedImage(imageUrl, prompt) {

    if (!chat) return;

    const wrapper = document.createElement("div");

    wrapper.className = "message ai generated-image-message";

    const avatar = document.createElement("div");

    avatar.className = "avatar";
    avatar.textContent = "🤖";

    const bubble = document.createElement("div");

    bubble.className = "bubble image-result-bubble";

    // Image
    const image = document.createElement("img");

    image.className = "generated-image";

    image.src = imageUrl;

    image.alt = prompt || "Generated image";

    image.loading = "lazy";

    // Prompt
    const promptBox = document.createElement("div");

    promptBox.className = "generated-image-prompt";

    promptBox.textContent =
        "🎨 " + (prompt || "Generated image");

// ==========================
// Rewrite Prompt Button
// ==========================

const rewriteBtn = document.createElement("button");

rewriteBtn.type = "button";
rewriteBtn.className = "image-action-btn";
rewriteBtn.innerHTML = "✏️ Rewrite Prompt";

rewriteBtn.onclick = async function () {

    try {

        rewriteBtn.disabled = true;
        rewriteBtn.innerHTML = "⏳ Rewriting...";

        const response = await fetch(
            "/chat/rewrite-prompt",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    prompt: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Failed to rewrite prompt."
            );

        }

        // Put rewritten prompt into input box
        input.value = data.rewrittenPrompt;

        // Focus input
        input.focus();

        // Select the rewritten prompt
        input.select();

    }

    catch (error) {

        console.error(
            "REWRITE PROMPT ERROR:",
            error
        );

        alert(
            error.message ||
            "Could not rewrite prompt."
        );

    }

    finally {

        rewriteBtn.disabled = false;
        rewriteBtn.innerHTML = "✏️ Rewrite Prompt";

    }

};

    // Actions
    const actions = document.createElement("div");

    actions.className = "image-actions";

    // Download
    const downloadBtn = document.createElement("button");

    downloadBtn.type = "button";

    downloadBtn.className = "image-action-btn";

    downloadBtn.innerHTML = "⬇️ Download";

    downloadBtn.onclick = async function () {

        try {

            const response =
                await fetch(imageUrl);

            const blob =
                await response.blob();

            const blobUrl =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = blobUrl;

            link.download =
                `my-ai-image-${Date.now()}.png`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(blobUrl);

        }

        catch (error) {

            console.error(
                "IMAGE DOWNLOAD ERROR:",
                error
            );

            alert(
                "Could not download image."
            );

        }

    };


    // Regenerate
    const regenerateBtn =
        document.createElement("button");

    regenerateBtn.type = "button";

    regenerateBtn.className =
        "image-action-btn";

    regenerateBtn.innerHTML =
        "🔄 Regenerate";

    regenerateBtn.onclick =
        async function () {

            if (
                typeof generateImage !==
                "function"
            ) {

                return;

            }

            regenerateBtn.disabled =
                true;

            regenerateBtn.innerHTML =
                "⏳ Generating...";

            try {

                const result =
                    await generateImage(prompt);

                if (
                    !result ||
                    !result.imageUrl
                ) {

                    throw new Error(
                        result?.error ||
                        "Image generation failed."
                    );

                }

                image.src =
                    result.imageUrl;

                promptBox.textContent =
                    "🎨 " +
                    (result.prompt || prompt);

            }

            catch (error) {

                console.error(
                    "REGENERATE ERROR:",
                    error
                );

                alert(
                    error.message ||
                    "Image regeneration failed."
                );

            }

            finally {

                regenerateBtn.disabled =
                    false;

                regenerateBtn.innerHTML =
                    "🔄 Regenerate";

            }

        };


    actions.appendChild(downloadBtn);

    actions.appendChild(regenerateBtn);

    bubble.appendChild(image);

    bubble.appendChild(promptBox);

    bubble.appendChild(rewriteBtn);

    bubble.appendChild(actions);

    wrapper.appendChild(avatar);

    wrapper.appendChild(bubble);

    chat.appendChild(wrapper);

    chat.scrollTop =
        chat.scrollHeight;

}
