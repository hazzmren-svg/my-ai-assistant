// =========================
// Current User Storage
// =========================

function getStorageUser() {

    const savedUser =
        localStorage.getItem("currentUser");

    if (!savedUser) {
        return null;
    }

    try {

        return JSON.parse(savedUser);

    }

    catch (error) {

        console.error(
            "USER DATA ERROR:",
            error
        );

        return null;

    }

}


// =========================
// User Storage Key
// =========================

function getUserStorageKey(type) {

    const user =
        getStorageUser();

    if (!user || !user.id) {

        return null;

    }

    return `${type}_${user.id}`;

}


// =========================
// Chat History
// =========================

let history = [];


// Save Chat
function saveHistory() {

    const key =
        getUserStorageKey("history");

    if (!key) return;

    localStorage.setItem(
        key,
        JSON.stringify(history)
    );

}


// Load Chat
function loadHistory() {

    const key =
        getUserStorageKey("history");

    if (!key) {

        history = [];

        return;

    }

    const saved =
        localStorage.getItem(key);

    if (!saved) {

        history = [];

        return;

    }

    try {

        history =
            JSON.parse(saved);

    }

    catch (error) {

        console.error(
            "HISTORY LOAD ERROR:",
            error
        );

        history = [];

    }

}


// Clear Chat
function clearHistory() {

    const key =
        getUserStorageKey("history");

    history = [];

    if (!key) return;

    localStorage.removeItem(key);

}


// =========================
// Conversation Management
// =========================

let conversations = [];

let currentChatId = null;

// =========================
// Migrate Old Conversations
// =========================

function migrateOldConversations() {

    const user =
        getStorageUser();

    if (!user || !user.id) {
        return;
    }

    const newKey =
        `conversations_${user.id}`;

    // Already migrated
    if (localStorage.getItem(newKey)) {
        return;
    }

    // Old conversations
    const oldData =
        localStorage.getItem(
            "conversations"
        );

    if (!oldData) {
        return;
    }

    try {

        localStorage.setItem(
            newKey,
            oldData
        );

        console.log(
            "✅ Old conversations migrated."
        );

    }

    catch (error) {

        console.error(
            "❌ Conversation migration failed:",
            error
        );

    }

}

// =========================
// Load Conversations
// =========================

function loadConversations() {

    const key =
        getUserStorageKey("conversations");

    conversations = [];

    currentChatId = null;

    if (!key) return;

    const saved =
        localStorage.getItem(key);

    if (!saved) return;

    try {

        conversations =
            JSON.parse(saved);

    }

    catch (error) {

        console.error(
            "CONVERSATIONS LOAD ERROR:",
            error
        );

        conversations = [];

    }

}


// =========================
// Save Conversations
// =========================

function saveConversations() {

    const key =
        getUserStorageKey("conversations");

    if (!key) return;

    localStorage.setItem(
        key,
        JSON.stringify(conversations)
    );

}


// =========================
// Create New Conversation
// =========================

function createConversation() {

    const id =
        Date.now().toString();

    const chat = {

        id,

        title: "New Chat",

        messages: []

    };

    conversations.unshift(chat);

    currentChatId = id;

    saveConversations();


    // =========================
    // Add Chat To Current Project
    // =========================

    if (currentProjectId) {

        addChatToProject(id);

    }


    return chat;

}


// =========================
// Current Conversation
// =========================

// বর্তমান Conversation বের করে
function getCurrentConversation() {

    return conversations.find(
        c =>
            c.id === currentChatId
    );

}


// =========================
// Add Message
// =========================

function addMessageToConversation(type, text, imageUrl = null) {

    const chat = getCurrentConversation();

    if (!chat) return;

    chat.messages.push({
        type,
        text,
        imageUrl
    });


    // Auto title
    // from first user message

if (
        type === "user" &&
        chat.messages.length === 1
    ) {
        chat.title = text.substring(0, 30);
    }

    saveConversations();
}

// =========================
// Load Current Conversation
// =========================

function loadCurrentConversation() {

    const chat = document.getElementById("chat");

    if (!chat) return;

    chat.innerHTML = "";

    const current =
        getCurrentConversation();

    if (!current) return;


    current.messages.forEach(
        msg => {

            // =========================
            // User Message
            // =========================

            if (msg.type === "user") {

                const box =
                    createMessage("user");

                box
                    .querySelector(".bubble")
                    .textContent =
                    msg.text;

                return;
            }


            // =========================
            // AI Image Message
            // =========================

            if (
                msg.type === "ai" &&
                msg.imageUrl
            ) {

                showGeneratedImage(
                    msg.imageUrl,
                    msg.text
                );

                return;
            }


            // =========================
            // Normal AI Text Message
            // =========================

            const box =
                createMessage("ai");

            const markdown =
                box.querySelector(".markdown");

            markdown.innerHTML =
                marked.parse(
                    msg.text || ""
                );


            const copyBtn =
                box.querySelector(".copy-btn");


            if (copyBtn) {

                copyBtn.onclick =
                    async () => {

                        await navigator
                            .clipboard
                            .writeText(
                                msg.text || ""
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

                    };

            }

        }
    );

    chat.scrollTop =
        chat.scrollHeight;

}


// =========================
// Delete Conversation
// =========================

function deleteConversation(id) {

    conversations =
        conversations.filter(
            chat =>
                chat.id !== id
        );


    // যদি সব Chat Delete হয়ে যায়

    if (
        conversations.length === 0
    ) {

        createConversation();

    }


    currentChatId =
        conversations[0].id;


    saveConversations();


    renderConversationList();

    loadCurrentConversation();

}


// =========================
// Rename Conversation
// =========================

function renameConversation(
    id,
    newTitle
) {

    const chat =
        conversations.find(
            c =>
                c.id === id
        );


    if (!chat) return;


    chat.title =
        newTitle.trim();


    saveConversations();

    renderConversationList();

}
// =========================
// Project Management
// =========================

let projects = [];
let currentProjectId = null;


// =========================
// Project Storage Key
// =========================

function getProjectStorageKey() {

    const user =
        getStorageUser();

    if (!user || !user.id) {
        return null;
    }

    return `projects_${user.id}`;

}


// =========================
// Save Projects
// =========================

function saveProjects() {

    const key =
        getProjectStorageKey();

    if (!key) return;

    localStorage.setItem(
        key,
        JSON.stringify(projects)
    );

}


// =========================
// Load Projects
// =========================

function loadProjects() {

    const key =
        getProjectStorageKey();

    projects = [];

    currentProjectId = null;

    if (!key) return;

    const saved =
        localStorage.getItem(key);

    if (!saved) return;

    try {

        projects =
            JSON.parse(saved);

    }

    catch (error) {

        console.error(
            "PROJECTS LOAD ERROR:",
            error
        );

        projects = [];

    }

}


// =========================
// Create Project
// =========================

function createProject(name) {

    const projectName =
        name.trim();

    if (!projectName) {
        return null;
    }

    const project = {

        id:
            Date.now().toString(),

        name:
            projectName,

        chatIds: []

    };

    projects.unshift(project);

    currentProjectId =
        project.id;

    saveProjects();

    return project;

}


// =========================
// Get Current Project
// =========================

function getCurrentProject() {

    return projects.find(
        project =>
            project.id ===
            currentProjectId
    );

}


// =========================
// Add Chat To Project
// =========================

function addChatToProject(chatId) {

    const project =
        getCurrentProject();

    if (!project) return;

    if (
        !project.chatIds.includes(chatId)
    ) {

        project.chatIds.push(chatId);

        saveProjects();

    }

}


// =========================
// Delete Project
// =========================

function deleteProject(id) {

    projects =
        projects.filter(
            project =>
                project.id !== id
        );

    if (
        currentProjectId === id
    ) {

        currentProjectId =
            projects.length
                ? projects[0].id
                : null;

    }

    saveProjects();

}