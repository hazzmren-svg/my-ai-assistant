const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const usersFile = path.join(
    __dirname,
    "../../data/users.json"
);

// Make sure users.json exists
function loadUsers() {

    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(
            usersFile,
            "[]",
            "utf8"
        );
    }

    const data =
        fs.readFileSync(
            usersFile,
            "utf8"
        );

    return JSON.parse(data);
}


// Save users
function saveUsers(users) {

    fs.writeFileSync(
        usersFile,
        JSON.stringify(
            users,
            null,
            2
        ),
        "utf8"
    );

}


// =========================
// Register User
// =========================

async function registerUser(
    name,
    email,
    password
) {

    const users = loadUsers();

    const existingUser =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );

    if (existingUser) {

        throw new Error(
            "Email already registered."
        );

    }


    // Hash password
    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );


    const newUser = {

        id: Date.now().toString(),

        name,

        email:
            email.toLowerCase(),

        password:
            hashedPassword,

        createdAt:
            new Date().toISOString()

    };


    users.push(newUser);

    saveUsers(users);


    return {

        id: newUser.id,

        name: newUser.name,

        email: newUser.email

    };

}


// =========================
// Login User
// =========================

async function loginUser(
    email,
    password
) {

    const users = loadUsers();

    const user =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (!user) {

        throw new Error(
            "Invalid email or password."
        );

    }


    const passwordMatch =
        await bcrypt.compare(
            password,
            user.password
        );


    if (!passwordMatch) {

        throw new Error(
            "Invalid email or password."
        );

    }


    return {

        id: user.id,

        name: user.name,

        email: user.email

    };

}


module.exports = {

    registerUser,

    loginUser

};