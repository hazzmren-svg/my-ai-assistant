// =========================
// Login
// =========================

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const loginBtn =
    document.getElementById("loginBtn");


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;


        // Show loading
        loginBtn.disabled = true;

        loginBtn.textContent =
            "Logging in...";

        loginMessage.textContent = "";


        try {

            const response =
                await fetch(
                    "/api/auth/login",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            email,

                            password

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Login failed."
                );

            }


            // Save logged-in user
            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.user)
            );
console.log(
    "LOGIN USER:",
    data.user
);

console.log(
    "SAVED CURRENT USER:",
    localStorage.getItem("currentUser")
);

            loginMessage.textContent =
                "✅ Login successful!";


            // Go to AI app
            setTimeout(() => {

                window.location.href =
                    "/";

            }, 500);


        }

        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            loginMessage.textContent =
                "❌ " + error.message;

        }


        finally {

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Login";

        }

    }
);