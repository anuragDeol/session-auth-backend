const User = require('../models/User');

// 4a. Register
exports.register = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({
            message: 'Missing username or password'
        });
    }

    try {
        let user = await User.findOne({ username });
        if(user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        
        user = new User({ username, password });
        await user.save();

        req.session.userId = user._id;
        req.session.username = user.username;
        res.status(201).json({
            message: 'User registered (and logged in) successfully'
        });
        return;
    } catch (error) {
        console.error('Error in register controller:', error)
        return res.status(500).json({
            error: 'Something went wrong. User registeration failed.'
        })
    }
}

// 4b. Login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({
            message: 'Missing username or password'
        });
    }

    try {
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(400).json({
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
            message: 'Logged in successfully!',
            user: {
                id: user._id,
                username: user.username
            }
        });
        return;
    } catch(error) {
        console.error('Error in login controller:', error.message);
        return res.status(500).json({
            error: 'Something went wrong. Unable to login user.'
        });
    }
}

// 4c. Logout
exports.logout = (req, res) => {
    try {
        req.session.destroy((error) => {
            if(error) {
                console.error('Error in Logout controller:', error)
                return res.status(500).json({
                    error: 'Something went wrong. Cannot log out user successfully.'
                });
            }
            res.clearCookie('anurag-auth-session-cookie');     // Clears default express-session cookie
            res.status(200).json({
                message: 'Logged out successfully (session destroyed)'
            });
            return;
        });
    } catch(error) {
        console.error('Error in Logout controller:', error)
        return res.status(500).json({
            error: 'Something went wrong. Cannot log out user successfully.'
        });
    }
}

// 4d. Session Info about the user
exports.me = (req, res) => {
    return res.json({
        user: {
            id: req.session.userId,
            username: req.session.username
        }
    });
}