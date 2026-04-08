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
app.use(passport.initialize());

app.post('/api/user/register', (req, res) => {
  userService
    .registerUser(req.body)
    .then((msg) => {
      res.status(200).json({ message: msg });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

app.post('/api/user/login', (req, res) => {
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
});

app.get('/api/user/favourites', passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.getFavourites(req.user._id)
    .then(data => {
        res.status(200).json(data);
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })

});

app.put('/api/user/favourites/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.addFavourite(req.user._id, req.params.id)
    .then(data => {
        res.status(200).json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

app.delete('/api/user/favourites/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    userService.removeFavourite(req.user._id, req.params.id)
    .then(data => {
        res.status(200).json(data)
    }).catch(msg => {
        res.status(422).json({ error: msg });
    })
});

userService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log('API listening on: ' + HTTP_PORT) });
})
.catch((err) => {
    console.log('unable to start the server: ' + err);
    process.exit();
});
