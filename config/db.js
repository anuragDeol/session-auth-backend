const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Success - Connection with database successful');
    } catch(err) {
        console.error('Failed - Database connection error:', err);
        process.exit(1);
    }
    // await mongoose.connect(MONGO_URI)
    // .then((mongooseInstance) => {
    //     console.log('Success! Connected to MongoDB');
    //     app.listen(3000, () => {
    //         console.log('Auth server is up and running on port: 3000');
    //     })
    //     return mongooseInstance.connection.getClient();
    // })
    // .catch((error) => {
    //     console.error('Error! Database connection error:', error);
    // })
}

module.exports = connectDB;