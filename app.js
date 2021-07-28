require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//connect to db
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (err) => {
  if (!err) console.log("MONGOOSE IS SUCCESSFULLY CONNECTED!");
});

//init
const app = express();

//ejs
app.set('view engine','ejs');

//public folder
app.use(express.static('./public'));

//express middlewares
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());




//set routes
let url = require('./routes/url')
app.use('/',url);

const port = 4000;
app.listen(port,()=>{
    console.log("running at port 4000");
})