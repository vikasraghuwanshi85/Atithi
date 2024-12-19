const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
var auth = require('../services/authentication');


router.get('/gettablekots/:id', auth.authenticateToken, (req, res)=>{
	const id = req.params.id;
	var query = "SELECT * FROM kotinfo WHERE tid = ?";
   connection.query(query, [id], (err, results) => {
		if(!err){
			return res.status(200).json(results);
		} else {
			return res.status(500).json(err);
		}
	})
})


module.exports = router;
