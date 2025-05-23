const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);

        console.log(`MongoDB Connected: ${conn.connection.host}`); //I just learned how to fetch the out the connection stream (host)

    } catch (error) {
        
        console.error("Database connection failed:", error.message);

        process.exit(1); //safe exist!
    }
};

module.exports = connectDB;
