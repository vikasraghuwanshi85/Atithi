const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
 

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

require('dotenv').config();

router.post('/signup', (req, res) => {
	let user = req.body;
	query = "select email, password, role, status from userinfo where email=?"

	if(user.email) {
		connection.query(query, [user.email], (err, results) => {
			if(!err){
				if(results.length <= 0) {
					query1 = "insert into userinfo(name, contactNumber, email, password, status, role) value(?,?,?,?, 'false', 'user')";
					connection.query(query1, [user.name, user.contactNumber, user.email, user.password], (err1, results) => {
						if(!err1) {
							return res.status(200).json({ message: 'Successfully Registered'});
						} else {
							return res.status(500).json(err1);
						}
					});
				} else {
					return res.status(400).json({ message: "Email already exist."})
				}
			} else {
				return res.status(500).json(err);
			}
		})
	} else {
		return res.status(500).json({ message: user });
	}

});

router.post('/login', (req, res) => {
	const user = req.body;
	query = "select id, email, password, role, status from userinfo where email=?";
	connection.query(query, [user.email], (err, results) => {
		if(!err && results) {
			if(results.length < 0 || results[0]?.password != user.password) {
				return res.status(401).json({ message: "Incorrect Username or password"});
			} else if(results[0]?.status == 'false'){
				return res.status(401).json({ message: "Wait for Admin Approval."})
			} else if(results[0]?.password == user.password) {
				const response = { uid: results[0].id, email: results[0]?.email, role: results[0].role };
				const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '12h'});
				res.status(200).json({token: accessToken});
			} else {
				return res.status(400).json({ message: "Something went wrong."})
			}
		} else {
			return res.status(500).json(err);
		}
	})
});

router.post('/forgotPassword', (req, res)=>{
	const user = req.body;
	query = "select email, password from userInfo where email=?";

	connection.query(query, [user.email], (err, results) => {
		if(!err){
			if(results.length <= 0){
				return res.status(200).json({ message: "- Password sent successfully to your email."});
			} else {
				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: process.env.EMAIL,
						pass: process.env.PASSWORD
					},
					port: 587,
					secure: false,
					requireTLS: true
				});
				var mailOptions = {
					from: process.env.EMAIL,
					to: results[0].email,
					subject: 'Password by Cafe Software',
					html: '<p><b>Your Login details for Cafe software </b></br><Email:</b>'+ results[0].email+'</p>'
				}

				transporter.sendMail(mailOptions, function(error, info){
					if(error) {
						console.log(error);
					} else {
						console.log('Email Send ' + info.response);
					}
				});
				return res.status(200).json({ message: "Password send successfully to your email."})
			}
		} else {
			console.log(err);
		}
	});
});

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
	var query = "select id, name, contactNumber, email, status, role from userInfo where role='user'";
	connection.query(query, (err, results)=>{
		if(!err){
			return res.status(200).json(results);
		} else {
			return res.status(500).json(err);
		}
	})	
});

router.patch('/update', auth.authenticateToken, (req, res) => {
	let user = req.body;
	var query = "update userInfo set status=? where id=?";

	connection.query(query, [user.status, user.id], (err, results)=>{
		if(!err) {
			if ( results.affectedRow == 0){
				return res.status(404).json({ message: "User id does not exist." });
			}
			return res.status(200).json({ message: "User updated successfully."});
		} else {
			return res.status(500).json(err);
		}
	})
});

router.get('/checkToken', auth.authenticateToken, (req, res)=>{
	return res.status(200).json({ message: 'true'});
});

router.post('/changePassword', auth.authenticateToken, (req, res)=>{
	const user = req.body;
	const email = res.locals.email;
	var query = "select * from userInfo where email=? AND password=?";
	connection.query(query, [user.email, user.oldPassword], (err, results)=>{
		if(!err){
			if (results.length <= 0){
				return res.status(400).json({ message: "Incorrect Old Password" });
			} else if(results[0].password == user.oldPassword){
				query = "update userInfo set password=? where email=?";
				connection.query(query, [user.newPassword, user.email], (err, results1)=>{
					if(!err && results1.affectedRow != 0){
						return res.status(200).json({ message: 'Password Updated Successfully.'});
					} else {
						return res.status(500).json(err);
					}
				});
			} else {
				return res.status(500).json({ message: 'Something went wrond. Please try again later.'});
			}
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;



