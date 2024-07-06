require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');

// Use environment variables
const DB = process.env.DB;
const PORT = process.env.PORT || 4000;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// MongoDB connection
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch(error => {
    console.log(error);
});

// Define a Mongoose schema and model here (same as before)
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors({
    origin: CORS_ORIGIN,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));
app.options('*', cors({
    origin: CORS_ORIGIN,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json("shubham sharma");
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    console.log(firstname, lastname, email, password);

    try {
        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if a user with the provided email exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // If credentials are correct, login successful
        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
