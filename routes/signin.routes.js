const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const { userModel } = require("../module/user.model");



router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are mandatory"
        });
    }

    try {
        let user = await userModel.findOne({ email });
       
        if (!user) {
            const subUser = await userModel.findOne({ "subUser.email": email });
            if (!subUser) {
                return res.status(401).json({ message: 'Login failed: User not found' });
            }
            const subUserData = subUser.subUser.find(sub => sub.email === email && sub.password === password);
            if (!subUserData) {
                return res.status(401).json({ message: 'Login failed: Incorrect password' });
            }
            user = subUserData; 
        } else {
            if (password !== user.password) {
                return res.status(401).json({ message: 'Login failed: Incorrect password' });
            }
        }
    
        console.log("User:", user); 
        const secretKey = '123';
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '10h' });
    
        
        res.json({ message: 'Login Success', token, email: user.email, role: user.role, userId: user._id, vendorId: user.vendorId });
    } catch (error) {
        console.error("Error:", error); 
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});




module.exports = router;