const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const route = require('./routes');
const db = require('./config/db/index');
const http = require('http');
const socketio = require('socket.io');
const session = require('express-session')
const MongoStore = require('connect-mongo');


require('dotenv').config();


const server = http.createServer();
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
server.listen(4441);


// Init our socket

db.connection();
app.use('/images', express.static(path.join(__dirname, 'public/img')));
// app.use('/images', express.static('images')); 

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/Artemis'
  })
}));
// Http logger
app.use(morgan('combined'))



// Template Engin
app.engine('hbs', handlebars({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


//Routes init
route(app);

// middleware
require('./app/middleware/socket')(io);



const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})