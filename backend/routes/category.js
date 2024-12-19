
const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
 

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

require('dotenv').config();


router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
	let category = req.body;
	query = "insert into category (name, colorcode) values(?, ?)";
	connection.query(query, [category.name, category.colorcode], (err, results) => {
		if(!err){
			return res.status(200).json({message: "Category Added Successfully."});
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/get', auth.authenticateToken, (req, res)=>{
	var query = "Select id, name, colorcode from category";
	connection.query(query, (err, results)=>{
		if(!err){
			return res.status(200).json(results);
		} else {
			return res.status(500).json(err);
		}
	})
});


router.patch('/update', auth.authenticateToken, (req, res)=>{
	let product = req.body;
	var query = "update category set name=?, colorcode=? where id=?";
	connection.query(query,[product.name, product.colorcode, product.id], (err, results)=>{
		if(!err){
			if(results.affectedRows == 0){
				return res.status(404).json({message: 'Category Id does not found.'});
			}
			return res.status(200).json({message: "Category Updated Successfully."});
		} else {
			return res.status(500).json(err);
		}
	})


});

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
	const id = req.params.id;
	var query = "delete from category where id=?";
	connection.query(query, [id], (err, results)=>{
		if(!err){
			if(results.affectedRows == 0){
				return res.status(404).json({message: "Category id does not found."});
			} else {
				return res.status(200).json({message: "Category delete Successfully."});
			}
		} else {
			return res.status(500).json(err);
		}
	})
})




module.exports = router;

