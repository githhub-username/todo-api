const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();

app.use(express.json({}));
app.use(express.json({
    extended: true
}))

app.use(morgan('dev'));

dotenv.config({
    path: './config/config.env'
});

connectDB();

app.use('/api/todo/auth', require('./routes/user'));
app.use('/api/todo', require('./routes/todo'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.red.underline.bold);
});
