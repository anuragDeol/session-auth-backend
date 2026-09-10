const express = require('express');
const sessions = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo').default;
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// 2. Express-Session middleware configuration with MongoStore
app.use(
    sessions({
        name: 'anurag-auth-session-cookie',
        secret: process.env.SESSION_SECRET,                 // used to sign the session ID cookie
        resave: true,                                       // prevents saving session if unmodified
        saveUninitialized: false,                           // prevents storing empty sessions
        store: MongoStore.create({
            // clientPromise,
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions',                     // target collection name in mongodb
            ttl: 24 * 60 * 60                          // session expiration time (1 day)
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,                    // cookie expiration (1 day)
            httpOnly: true,                                 // prevents client-side js from accessing the cookie
            secure: process.env.NODE_ENV === 'production',  // set true if utilizing HTTPS
            sameSite: 'lax'
        }
    })
);

// 3. Mount Routes
app.use('/api/auth', authRoutes);

// 4. Connect to MongoDB
connectDB().then(() => {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`Server up and running on port: ${PORT} 🚀`);
  });
}).catch((err) => {
  console.error('App failed to boot:', err.message);
  process.exit(1);
});