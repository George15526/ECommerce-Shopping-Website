// confug/config.js

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 1000,
};

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { COOKIE_OPTIONS, JWT_SECRET };