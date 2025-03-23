// server/index.js

require('dotenv').config();
const express = require("express");
const app = express();
const authRoutes = require('./routes/authRoutes');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { sequelize } = require('./config/db')
const { swaggerUi, swaggerSpec } = require("./swagger");


app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use('/api/v1', authRoutes);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, async () => {
        try {
            await sequelize.authenticate();
            console.log('MySQL connected successfully');
            
            await sequelize.sync();
            console.log('Tables sync successfully');
        } catch (error) {
            console.log('Unable to connect to MySQL:', error);
        }
        console.log(`Server is running on http://localhost:${PORT}/api/v1`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api/v1/api-docs`);
    });
};

module.exports = app;