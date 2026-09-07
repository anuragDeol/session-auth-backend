const User = require('../models/User');

// 4a. Register
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if(user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        
        user = new User({ username, password });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 4b. Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if(!user) {
            res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // User found - Save session payload - attach custom variables to session object
        req.session.userId = user._id;
        req.session.username = user.username;

        res.status(200).json({
            message: 'Logged in successfully!'
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
}

// 4c. Logout
exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if(error) {
            return res.status(500).json({
                error: error.message
            });
        }
        res.clearCookie('anurag-auth-session-cookie');     // Clears default express-session cookie
        res.status(200).json({
            message: 'Logged out successfully (session destroyed)'
        });
    });
}

// 4d. Redirect to Home
exports.home = (req, res) => {
    res.json({
        message: 'Welcome Home',
        user: {
            id: req.session.userId,
            username: req.session.username
        }
    });
}