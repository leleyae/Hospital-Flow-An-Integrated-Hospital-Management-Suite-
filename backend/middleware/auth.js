// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Cookie configuration
const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Send JWT Token as cookie
const createSendToken = (user, statusCode, res) => {
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    });
};

// Authentication Middleware
exports.protect = async (req, res, next) => {
    try {
        let token;

        // 1) Get token from either cookie or Authorization header
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'error',
                message: 'The user belonging to this token no longer exists.'
            });
        }

        // 4) Check if user changed password after the token was issued
        if (currentUser.passwordChangedAt) {
            const changedTimestamp = parseInt(
                currentUser.passwordChangedAt.getTime() / 1000,
                10
            );
            if (decoded.iat < changedTimestamp) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User recently changed password! Please log in again.'
                });
            }
        }

        // 5) Check if user is active
        if (!currentUser.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'Your account has been deactivated'
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token. Please log in again!'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Your token has expired! Please log in again.'
            });
        }

        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Role-based Authorization Middleware
exports.auth = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

// Export cookie options and token generator
exports.cookieOptions = cookieOptions;
exports.generateToken = generateToken;
exports.createSendToken = createSendToken;