// =========================
// Sign Up
// =========================

const signupForm =
    document.getElementById("signupForm");

const signupMessage =
    document.getElementById("signupMessage");

const signupBtn =
    document.getElementById("signupBtn");


signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("signupName")
                .value
                .trim();


        const email =
            document
                .getElementById("signupEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("signupPassword")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        // =========================
        // Check Password
        // =========================

        if (password !== confirmPassword) {

            signupMessage.textContent =
                "❌ Passwords do not match.";

            return;

        }


        // =========================
        // Loading
        // =========================

        signupBtn.disabled = true;

        signupBtn.textContent =
            "Creating Account...";

        signupMessage.textContent = "";


        try {

            const response =
                await fetch(
                    "/api/auth/signup",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            name,

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
                    "Signup failed."
                );

            }


            // =========================
            // Success
            // =========================

            signupMessage.textContent =
                "✅ Account created successfully!";


            // Go to Login
            setTimeout(() => {

                window.location.href =
                    "/login.html";

            }, 1000);


        }

        catch (error) {

            console.error(
                "SIGNUP ERROR:",
                error
            );


            signupMessage.textContent =
                "❌ " + error.message;

        }


        finally {

            signupBtn.disabled = false;

            signupBtn.textContent =
                "Create Account";

        }

    }
);