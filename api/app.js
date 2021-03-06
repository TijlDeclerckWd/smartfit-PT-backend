let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let devEnv = require('../development.config');
let prodEnv = require('../prod.config');


// Make sure that you add this later to the process.env
const whitelist = ['http://localhost:4300'];
const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        console.log('CORS origin', origin);
        if(whitelist.includes(origin))
            return callback(null, true);

        callback(new Error('Not allowed by CORS'));
    }
};

const {
    authRoutes,
    userRoutes,
    clientRoutes,
    trainerRoutes,
    exerciseRoutes,
    workoutRoutes,
    statsRoutes,
    messagesRoutes
} = require('./routes');

let app = express();



// Load 'development' configs for dev environment
if (process.env.NODE_ENV !== 'production') {
    console.log('were in dev mode');
    devEnv.init();
} else {
    console.log('were in prod mode');
    prodEnv.init();
}

// Open Mongoose connection to db
require('../db');

// cors middleware for orign and Headers
app.use(cors());

app.use((req, res, next) => {
    // console.log('ORIGIN', req.headers.origin);
    // res.setHeader("Access-Control-Allow-Origin", 'http://localhost:4300');
res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
);
res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
);
next();
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/uploads', express.static(process.env.FILE_UPLOAD_FOLDER));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/messages', messagesRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
