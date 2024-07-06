const mongoose = require('mongoose');
const express = require("express");
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');

// MongoDB connection string including the database name
const DB = 'mongodb+srv://sharmashubu4600:pKHWJWZI2YKqIj9g@project.beleaer.mongodb.net/test?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch(error => {
    console.log(error);
});

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    }
});


// Create a Mongoose model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors({
    origin:[https://vercel-project-frontend.vercel.app/],
    methods:['POST','GET'],
    credentials: true
}));
app.use(express.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
 console.log(firstname, lastname, email, password)

    try {
        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
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
        
        // Optionally, you can redirect to another page using client-side JavaScript
        // Example: res.redirect('/dashboard');

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
