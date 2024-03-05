const { Router } = require("express");
const router = Router();
const { userModel } = require("../module/user.model");

router.post("/", async (req, res) => {
    const { email, password, role, name } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are mandatory"
        });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }

    // Create new user
    const newUser = new userModel({
        email: email,
        password: password,
        role: role
    });

    try {
        await newUser.save();
        res.json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        });
    }
});

module.exports = router;