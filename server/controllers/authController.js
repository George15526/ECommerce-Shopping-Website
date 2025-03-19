// authContoller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/mysql/User');
const { sendVerification } = require('../utils/email');
const { JWT_SECRET } = require('../config/config');
const { COOKIE_OPTIONS } = require('../config/config');


// 用戶註冊
exports.register = async (req, res) => {
	/**
	 * @swagger
	 * /api/v1/auth/register:
	 *   post:
	 *     description: User register.
	 *     tags:
	 *       - Authentication
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 description: User's name
	 *                 required: true
	 *                 example: "George"
	 *               email:
	 *                 description: User's email
	 *                 required: true
	 *                 example: "george920102@gmail.com"
	 *               password:
	 *                 description: User's password
	 *                 required: true
	 *                 example: "georgePassword"
	 *     responses:
	 *       201:
	 *         description: User registered. Please verify your email.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status:
	 *                   type: string
	 *                   example: "success"
	 *                 message:
	 *                   type: string
	 *                   example: "User registered. Please verify your email."
	 *       400:
	 *         description: Email already in use
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status:
	 *                   type: string
	 *                   example: "error"
	 *                 message:
	 *                   type: string
	 *                   example: "Email already in use"
	 *       500:
	 *         description: Database error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status:
	 *                   type: string
	 *                   example: "error"
	 *                 message:
	 *                   type: string
	 *                   example: "Database error"
	 */
    const { name, email, password } = req.body;    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already in use',
            });
        }
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        console.log(token);

        await sendVerification(email, token);

        return res.status(201).json({
            status: 'success',
            message: 'User registered. Please verify your email.',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Database error',
        });
    };
};

exports.verifyEmail = async (req, res) => {
	/**
	 * @swagger
	 * /api/v1/auth/verify/{token}:
	 *   get:
	 *     description: Verify user's email using a token sent via email.
	 *     tags:
	 *       - Authentication
	 *     parameters:
	 *       - name: token
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Verification token
	 *     responses:
	 *       200:
	 *         description: Emmail verified successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: "Email verified successfully"
	 *       400:
	 *         description: Invalid or expired token
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "Invalid or expired token"
	 */
  	try {
		const { token } = req.params;
		const decoded = jwt.verify(token, JWT_SECRET);

		await User.update(
			{ isVerified: true },
			{
				where: {
					email: decoded.email,
				},
			},
		);

		console.log('Email verified successfully');
		res.send('Email verified successfully');
	} catch (error) {
		console.log('Invalid or expired token');
		res.status(400).send('Invalid or expired token');
	}
};

// 用戶登入
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email: email } });
		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials' });
		};
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ error: 'Invalid credentials' });
		};
		const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
		console.log(token);
		res.cookie('token', token, COOKIE_OPTIONS);
		console.log(document.token)

		return res.json({
			status: 'success',
			message: 'Login successfully',
			data: user,
		});
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};