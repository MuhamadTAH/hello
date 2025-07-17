require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const TikTokStrategy = require('passport-tiktok').Strategy;
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const { CLIENT_KEY, CLIENT_SECRET, CALLBACK_URL, SESSION_SECRET } = process.env;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Sessions
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new TikTokStrategy({
  clientID: CLIENT_KEY,
  clientSecret: CLIENT_SECRET,
  callbackURL: CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken });
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Auth routes
app.get('/auth/tiktok', passport.authenticate('tiktok'));
app.get('/auth/tiktok/callback', passport.authenticate('tiktok', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

// Middleware to ensure login
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/tiktok');
}

// Chat functionality
io.on('connection', socket => {
  const user = socket.request.session.passport?.user.profile.displayName || 'Guest';
  socket.on('chatMessage', text => {
    io.emit('chatMessage', { user, text });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
