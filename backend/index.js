const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const sittingCatRoute = require('./routes/sitting_cats');
const productRoute = require('./routes/products');
const kotRoute = require('./routes/kot');
const billRoute = require('./routes/bill');

const app = express();
console.log(process.env.ROLE);

var listener = app.listen(5000, function(){
	console.log('Listening on port '+ listener.address().port);
});

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/products', productRoute);
app.use('/kot', kotRoute);
app.use('/bill', billRoute);
app.use('/sitting_cats', sittingCatRoute);

module.exports = app;