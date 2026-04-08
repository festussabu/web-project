const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
dotenv.config();
const userService = require('./user-service.js');

const HTTP_PORT = process.env.PORT || 8080;
let connectionPromise;

function ensureConnection() {
  if (!connectionPromise) {
    connectionPromise = userService.connect();
  }

  return connectionPromise;
}

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await userService.getUserById(jwtPayload._id);

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  next();
});
app.use(passport.initialize());
app.use(async (req, res, next) => {
  try {
    await ensureConnection();
    next();
  } catch (err) {
    res.status(500).json({ message: 'unable to connect to database' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'user api is running' });
});

function registerHandler(req, res) {
  userService
    .registerUser(req.body)
    .then((msg) => {
      res.status(200).json({ message: msg });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
}

function loginHandler(req, res) {
  userService
    .checkUser(req.body)
    .then((user) => {
      const payload = {
        _id: user._id,
        userName: user.userName,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'login successful', token });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
}

function getFavouritesHandler(req, res) {
  userService.getFavourites(req.user._id)
    .then(data => {
        res.status(200).json(data);
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })

}

function addFavouriteHandler(req, res) {
  userService.addFavourite(req.user._id, req.params.id)
    .then(data => {
        res.status(200).json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
}

function removeFavouriteHandler(req, res) {
  userService.removeFavourite(req.user._id, req.params.id)
    .then(data => {
        res.status(200).json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
}

app.post('/register', registerHandler);
app.post('/api/user/register', registerHandler);
app.post('/login', loginHandler);
app.post('/api/user/login', loginHandler);
app.get('/favourites', passport.authenticate('jwt', { session: false }), getFavouritesHandler);
app.get('/api/user/favourites', passport.authenticate('jwt', { session: false }), getFavouritesHandler);
app.put('/favourites/:id', passport.authenticate('jwt', { session: false }), addFavouriteHandler);
app.put('/api/user/favourites/:id', passport.authenticate('jwt', { session: false }), addFavouriteHandler);
app.delete('/favourites/:id', passport.authenticate('jwt', { session: false }), removeFavouriteHandler);
app.delete('/api/user/favourites/:id', passport.authenticate('jwt', { session: false }), removeFavouriteHandler);

if (require.main === module) {
  ensureConnection()
    .then(() => {
      app.listen(HTTP_PORT, () => {
        console.log('API listening on: ' + HTTP_PORT);
      });
    })
    .catch((err) => {
      console.log('unable to start the server: ' + err);
      process.exit();
    });
}

module.exports = app;
