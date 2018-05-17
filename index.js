
// dependencies
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');

const http = require('http');
const path = require('path');

const events = require('./app/network/event');

// general conf
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const sessionSecret = process.env.SESSION_SECRET || 'unset';


// handlebars conf

let handlebars = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        ifEquals: (arg1, arg2, options) => {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        ifGt: (arg1, arg2, options) => {
            return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
        },
        json: (ctx, options) => {
            return JSON.stringify(ctx, null, options);
        },
    }
});

// general middlewares

app
.use(express.static(path.join(__dirname,'views/assets')))
.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
}))

// authentification
.use(passport.initialize())
.use(passport.session())

// to support JSON-encoded bodies
.use(bodyParser.json()) 

// to support URL-encoded bodies
.use(bodyParser.urlencoded({
  extended: true
})) 

// handlebars
.engine('.hbs', handlebars.engine)
.set('view engine', '.hbs')
.set('views', path.join(__dirname, 'views/layouts'));

// mongoose
/*
mongoose.connect(process.env.DB_URI || 'mongodb://localhost/rogueio');

mongoose.connection.on('error', (err) => {
    console.log('mongoose default connection error: '+err);
});

mongoose.connection.on('connected', () => {
    console.log('mongoose connected');
});

mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected');
});

process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    }); 
}); */

// socket io server
events.init(server);

/*
* ROUTES
*/

app
.get('/', (req, res) => {
    res.render('game', {
        
    });
})

// 401
.get('/forbidden', (req, res) => {
    res.status(401);
    res.render('login', {
        error: 'non autorisé'
    }); 
})

// 404

.get('*', (req, res) => {
    res.status(404);
    res.json({error:'not found'});
})

// error handler

.use((err, req, res, next) => {  
    console.log('server error : '+err);
    res.status(500);
    res.json({error:err});
});

// launch server

server.listen(port, (err) => {
   if(err) {
       console.log('server launch error : '+err);
   } else {
       console.log(`platform listening on port ${port}`);
   }
});



