// =========================
// SETTINGS PAGE
// =========================

document.addEventListener("DOMContentLoaded", function () {


    // =========================
    // Current User
    // =========================

    const savedUser =
        localStorage.getItem("currentUser");


    if (!savedUser) {

        window.location.replace("/login.html");

        return;

    }


    let currentUser = null;


    try {

        currentUser =
            JSON.parse(savedUser);

    }

    catch (error) {

        console.error(
            "USER DATA ERROR:",
            error
        );

        localStorage.removeItem(
            "currentUser"
        );

        window.location.replace(
            "/login.html"
        );

        return;

    }


    // =========================
    // Account Information
    // =========================

    const accountName =
        document.getElementById(
            "accountName"
        );

    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    if (accountName) {

        accountName.textContent =
            currentUser.name || "User";

    }


    if (accountEmail) {

        accountEmail.textContent =
            currentUser.email || "";

    }


    // =========================
    // Elements
    // =========================

    const backBtn =
        document.getElementById(
            "backBtn"
        );

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );

    const voiceLanguage =
        document.getElementById(
            "voiceLanguage"
        );

    const voiceSpeed =
        document.getElementById(
            "voiceSpeed"
        );

    const saveBtn =
        document.getElementById(
            "saveBtn"
        );

    const saveMessage =
        document.getElementById(
            "saveMessage"
        );

    const clearHistoryBtn =
        document.getElementById(
            "clearHistoryBtn"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    // =========================
    // Load Settings
    // =========================

    const savedSettings =
        localStorage.getItem(
            "myAISettings"
        );


    let settings = {

        lightMode: false,

        voiceLanguage: "en-US",

        voiceSpeed: "1"

    };


    if (savedSettings) {

        try {

            settings =
                {
                    ...settings,
                    ...JSON.parse(
                        savedSettings
                    )
                };

        }

        catch (error) {

            console.error(
                "SETTINGS LOAD ERROR:",
                error
            );

        }

    }


    // =========================
    // Apply Settings
    // =========================

    if (themeToggle) {

        themeToggle.checked =
            settings.lightMode;

    }


    if (voiceLanguage) {

        voiceLanguage.value =
            settings.voiceLanguage;

    }


    if (voiceSpeed) {

        voiceSpeed.value =
            settings.voiceSpeed;

    }


    if (settings.lightMode) {

        document.body.classList.add(
            "light-mode"
        );

    }


    // =========================
    // Theme Toggle
    // =========================

    if (themeToggle) {

        themeToggle.addEventListener(
            "change",
            function () {

                document.body.classList.toggle(
                    "light-mode",
                    themeToggle.checked
                );

            }
        );

    }


    // =========================
    // Back
    // =========================

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "/";

            }
        );

    }


    // =========================
    // Save Settings
    // =========================

    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            function () {

                const newSettings = {

                    lightMode:
                        themeToggle
                            ? themeToggle.checked
                            : false,

                    voiceLanguage:
                        voiceLanguage
                            ? voiceLanguage.value
                            : "en-US",

                    voiceSpeed:
                        voiceSpeed
                            ? voiceSpeed.value
                            : "1"

                };


                localStorage.setItem(

                    "myAISettings",

                    JSON.stringify(
                        newSettings
                    )

                );


                if (saveMessage) {

                    saveMessage.textContent =
                        "✅ Settings saved successfully!";

                }


                setTimeout(
                    function () {

                        if (saveMessage) {

                            saveMessage.textContent =
                                "";

                        }

                    },
                    2500
                );

            }
        );

    }


    // =========================
    // Clear Chat History
    // =========================

    if (clearHistoryBtn) {

        clearHistoryBtn.addEventListener(
            "click",
            function () {

                const confirmClear =
                    window.confirm(
                        "Are you sure you want to clear all chat history?"
                    );


                if (!confirmClear) {

                    return;

                }


                // Remove conversations
                const conversationKey =
                    currentUser.id
                        ? `conversations_${currentUser.id}`
                        : null;


                if (conversationKey) {

                    localStorage.removeItem(
                        conversationKey
                    );

                }


                // Remove old history
                const historyKey =
                    currentUser.id
                        ? `history_${currentUser.id}`
                        : null;


                if (historyKey) {

                    localStorage.removeItem(
                        historyKey
                    );

                }


                alert(
                    "✅ Chat history cleared."
                );

            }
        );

    }


    // =========================
    // Logout
    // =========================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                const confirmLogout =
                    window.confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {

                    return;

                }


                localStorage.removeItem(
                    "currentUser"
                );


                window.location.replace(
                    "/login.html"
                );

            }
        );

    }

});