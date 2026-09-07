const express = require('express');
const sessions = require('express-session');
const MongoStore = require('connect-mongo').default;
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. Global Middleware: Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Connect to MongoDB
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server up and running on port: ${PORT} 🚀`);
  });
}).catch((err) => {
  console.error('App failed to boot:', err.message);
  process.exit(1);
});

// 3. Express-Session middleware configuration with MongoStore
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
            ttl: 14 * 24 * 60 * 60                          // session expiration time (14 days)
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,                    // cookie expiration (1 day)
            httpOnly: true,                                 // prevents client-side js from accessing the cookie
            secure: process.env.NODE_ENV === 'production',  // set true if utilizing HTTPS
            sameSite: 'lax'
        }
    })
);

// 4. Mount Routes
app.use('/api/auth', authRoutes);