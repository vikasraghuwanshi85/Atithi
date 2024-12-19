const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
	let product = req.body;
	var query = "insert into product (name, categoryID, description, price, status) value(?,?,?,?,'true')";
	connection.query(query, [product.name, product.categoryID, product.description, product.price], (err, results)=>{
		if(!err){
			return res.status(200).json({ message: "Product Added."});
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/get', auth.authenticateToken, (req, res) => {
	var query = "select p.id, p.name, p.price, p.status, c.id as catId, c.name as catName from product as p INNER JOIN category as c ON p.categoryID = c.id order by p.name";
	connection.query(query, (err, results) => {
		if(!err) {
			return res.status(200).json(results);
		} else {
			return res.status(500).json(err);
		}
	})
});

router.get('/getByCategory/:id', auth.authenticateToken, (req, res) => {
	const id = req.params.id;
	var query = "select p.id, p.name, p.price, p.status, c.id as catId, c.name as catName from product as p INNER JOIN category as c ON p.categoryID = c.id WHERE c.id=? order by p.name";
	connection.query(query, [id], (err, results) => {
		if(!err) {
			return res.status(200).json(results);
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/getById/:id', auth.authenticateToken, (req, res) => {
	const id = req.params.id;
	var query = "select * from product WHERE id=?";
	connection.query(query, [id], (err, results)=>{
		if(!err){
			return res.status(200).json(results[0]);
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;


