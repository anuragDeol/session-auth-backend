const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Success - Connection with database successful');
    } catch(err) {
        console.error('Failed - Database connection error:', err);
        process.exit(1);
    }
}

module.exports = connectDB;