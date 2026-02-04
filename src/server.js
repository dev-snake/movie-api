require('dotenv').config();
const app = require('./app');
const db = require('../models');

const PORT = process.env.PORT || 3000;

// Test database connection and sync
db.sequelize
    .authenticate()
    .then(() => {
        console.log('✅ Database connection established successfully.');
        return db.sequelize.sync({ alter: false });
    })
    .then(() => {
        console.log('✅ Database synchronized.');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
            console.log(`📡 API Endpoints: http://localhost:${PORT}/api`);
        });
    })
    .catch((err) => {
        console.error('❌ Unable to connect to the database:', err);
        process.exit(1);
    });
