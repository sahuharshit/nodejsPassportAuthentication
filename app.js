const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./schemas/newUserSchema');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require('./config/authRestriction');
// Establishing connection to mongodb database
require('./config/mongodbconnection')();

// importing the configuration of passport js
require('./config/passportConfiguration')(passport);

// using middleware for the node application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))


//passport initialization 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash for custom server side messages
app.use(flash());

// Custom Variables that would select connect-flash messages
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.post('/createuser', (req,res)=>{
    const {email, password} = req.body;

    const newUser = new User({
        email,
        password
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
            .save()
            .then(user => {
                req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                );
                console.log('Sucessfully created new user')
                res.redirect('/login');
            })
            .catch(err => console.log(err));
        });
    });
})
// Login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/protected-route',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});
app.get('/login', (req,res)=>{
    res.send('authenticated');
})

app.get('/',forwardAuthenticated,(req,res)=>{
    res.sendStatus(200);
    res.send('hello from the homepage');
    res.end();
})


app.get('/protected-route',ensureAuthenticated, (req,res)=>{
    console.log(req.user)
    res.send('hello world')
} )

app.listen(3000, ()=>{
    console.log('port listening at 3000')
})