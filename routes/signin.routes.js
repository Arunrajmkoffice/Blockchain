const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const { userModel } = require("../module/user.model");

router.post("/", async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are mandatory"
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (user) {
            if (password === user.password) { 
                const secretKey = '123';
                const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '10h' });
                res.json({ message: 'Login Success', token, email: user.email, role:user.role, userId: user._id});
            } else {
                res.status(401).json({ message: 'Login failed: Incorrect password' });
            }
        } else {
            res.status(401).json({ message: 'Login failed: User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;