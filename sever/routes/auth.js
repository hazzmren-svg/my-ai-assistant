const express = require("express");

const {
    registerUser,
    loginUser
} = require("../services/authService");

const router = express.Router();


// =========================
// SIGN UP
// =========================

router.post("/signup", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check fields
        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email and password are required."

            });

        }


        // Basic password length
        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters."

            });

        }


        const user =
            await registerUser(
                name.trim(),
                email.trim(),
                password
            );


        res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            user

        });

    }

    catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );


        res.status(400).json({

            success: false,

            message:
                error.message ||
                "Signup failed."

        });

    }

});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields
        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        const user =
            await loginUser(
                email.trim(),
                password
            );


        res.json({

            success: true,

            message:
                "Login successful.",

            user

        });

    }

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        res.status(401).json({

            success: false,

            message:
                error.message ||
                "Login failed."

        });

    }

});


module.exports = router;