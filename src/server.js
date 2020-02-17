const { config } = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const routes = require('./routes');

config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB using mongoose
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const DB = mongoose.connection;
DB.on('error', (error) => console.error(error));
DB.once('open', () => console.log('connected to database'));

app.use(express.json());
app.use(morgan('dev'));
app.use('/subscribers', routes);

app.listen(PORT, () => console.log(`server started on ${PORT}`));
