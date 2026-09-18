const express = require('express');
const sessions = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo').default;
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { default: mongoose } = require("mongoose");
const sessionCookieOptions = require('./config/sessionConfig');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000/',
    credentials: true
}));

async function startServer() {
    await connectDB();
    app.use(
        sessions({
            name: 'anurag-auth-session-cookie',
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
                collectionName: 'sessions',
                ttl: 24 * 60 * 60
            }),
            cookie: {
                ...sessionCookieOptions,
                maxAge: 1000 * 60 * 60 * 24,
            }
        })
    );
    app.use('/api/auth', authRoutes);
    app.listen(PORT, () => console.log(`Server up and running on ${PORT} 🚀`));
}

startServer();