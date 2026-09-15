// UI Elements
const chat = document.getElementById("chat");
const input = document.getElementById("message");
const send = document.getElementById("send");
const newChat = document.getElementById("newChat");

// Create Message
function createMessage(type) {

    const wrapper = document.createElement("div");
    wrapper.className = `message ${type}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = type === "user" ? "👤" : "🤖";

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    if (type === "ai") {

        bubble.innerHTML = `
            <div class="markdown"></div>

            <button class="copy-btn">
                📋 Copy
            </button>
        `;

    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);

    chat.appendChild(wrapper);

    chat.scrollTop = chat.scrollHeight;

    return wrapper;

}

// Typing Indicator
function showTyping() {

    const wrapper = document.createElement("div");

    wrapper.className = "message ai";

    wrapper.id = "typing";

    wrapper.innerHTML = `

        <div class="avatar">🤖</div>

        <div class="bubble">

            <div class="typing">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    `;

    chat.appendChild(wrapper);

    chat.scrollTop = chat.scrollHeight;

}

function removeTyping() {

    const typing = document.getElementById("typing");

    if (typing) typing.remove();

}
// =========================
// Sidebar Conversation List
// =========================

const historyBox = document.getElementById("history");

function renderConversationList() {

    if (!historyBox) return;

    historyBox.innerHTML = "";

        // Hide project chat history when Projects are collapsed
    if (
        currentProjectId !== null &&
        typeof projectsOpen !== "undefined" &&
        !projectsOpen
    ) {
        return;
    }

    let visibleConversations = [];

    // =========================
    // PROJECT MODE
    // =========================

    if (currentProjectId) {

        const currentProject =
            projects.find(
                project =>
                    project.id === currentProjectId
            );

        if (currentProject) {

            // Only this Project's chats
            visibleConversations =
                conversations.filter(
                    chatData =>
                        currentProject.chatIds.includes(
                            chatData.id
                        )
                );

        }

    }

    // =========================
    // ALL CHATS MODE
    // =========================

    else {

        // Collect all Project chat IDs
        const projectChatIds =
            new Set();

        projects.forEach(function (project) {

            project.chatIds.forEach(function (chatId) {

                projectChatIds.add(chatId);

            });

        });

        // Show ONLY chats that are NOT
        // inside any Project
        visibleConversations =
            conversations.filter(
                chatData =>
                    !projectChatIds.has(
                        chatData.id
                    )
            );

    }

    // =========================
    // RENDER CONVERSATIONS
    // =========================

    visibleConversations.forEach(
        chatData => {

            const item =
                document.createElement("div");

            item.className =
                "history-item";

            if (
                chatData.id === currentChatId
            ) {

                item.classList.add("active");

            }

            item.innerHTML = `

                <span class="chat-title">
                    💬 ${chatData.title}
                </span>

                <div class="chat-actions">

                    <button
                        class="rename-chat"
                        type="button">
                        ✏️
                    </button>

                    <button
                        class="delete-chat"
                        type="button">
                        🗑️
                    </button>

                </div>

            `;

            // =========================
            // RENAME
            // =========================

            const renameBtn =
                item.querySelector(
                    ".rename-chat"
                );

            renameBtn.onclick =
                function (event) {

                    event.stopPropagation();

                    const newTitle =
                        prompt(
                            "Enter new chat title:",
                            chatData.title
                        );

                    if (
                        !newTitle ||
                        !newTitle.trim()
                    ) {

                        return;

                    }

                    renameConversation(
                        chatData.id,
                        newTitle.trim()
                    );

                };


            // =========================
            // DELETE
            // =========================

            const deleteBtn =
                item.querySelector(
                    ".delete-chat"
                );

            deleteBtn.onclick =
                function (event) {

                    event.stopPropagation();

                    deleteConversation(
                        chatData.id
                    );

                };


            // =========================
            // OPEN CHAT
            // =========================

            item.onclick =
                function () {

                    currentChatId =
                        chatData.id;

                    renderConversationList();

                    loadCurrentConversation();

                };


            historyBox.appendChild(item);

        }
    );

}
function showGeneratedImage(imageUrl, prompt = "") {
    const wrapper = document.createElement("div");
    wrapper.className = "message ai";

    wrapper.innerHTML = `
        <div class="avatar">🤖</div>

        <div class="bubble image-bubble">

            <div class="generated-image-container">
                <img
                    src="${imageUrl}"
                    alt="${prompt || "Generated image"}"
                    class="generated-image"
                >
            </div>

            <div class="image-actions">
                <a
                    href="${imageUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="image-open-btn"
                >
                    🔍 Open Image
                </a>

                <button
                    type="button"
                    class="copy-btn"
                    onclick="navigator.clipboard.writeText('${imageUrl}')"
                >
                    📋 Copy URL
                </button>
            </div>

        </div>
    `;

    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;

    return wrapper;
}