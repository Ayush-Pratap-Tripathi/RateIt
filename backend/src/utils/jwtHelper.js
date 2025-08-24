// src/utils/jwtHelper.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

module.exports = { generateToken };
