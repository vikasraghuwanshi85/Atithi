const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


router.put('/update/:id', auth.authenticateToken, (req, res)=>{

	const id = req.params.id;
	let kotinfo = req.body;
	let productString = JSON.stringify(kotinfo.product);
	var query = "UPDATE kotinfo SET product = ? WHERE kid = ?";
	connection.query(query,[productString, id], (err, results)=>{
		if(!err) {
			if ( results.affectedRow == 0){
				return res.status(404).json({ message: "KOT id does not exist." });
			}
			return res.status(200).json({ message: "KOT updated successfully."});
		} else {
			return res.status(500).json(err);
		}
	});

});

router.post('/add', auth.authenticateToken, (req, res)=>{
	let kotinfo = req.body;
	console.log('kotinfo',kotinfo);

	let productString = JSON.stringify(kotinfo.product);

	var query = "INSERT INTO kotinfo (tid, table_name, product, updated_by, status) value(?, ?, ?, ?, 'active')";
	connection.query(query, [kotinfo.tid, kotinfo.table_name, productString, kotinfo.updated_by], (err, results)=>{
		if(!err){
			return res.status(200).json({ message: "Product Added."});
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/getkots/:id', auth.authenticateToken, (req, res)=>{
	const id = req.params.id;
	var query = "SELECT kid, product FROM `kotinfo` WHERE status = 'active' AND tid = ?"
	connection.query(query, [id], (err, results)=>{
		if(!err){
			return res.status(200).json(results);
		} else {
			return res.status(500).json(err);
		}
	})
})


router.get('/get/:id?', auth.authenticateToken, (req, res)=>{

	const id = req?.params?.id;
	id_params = [];
	var query = "SELECT table_sitting_id as sid , table_sitting_name as name, table_sitting_category, (SELECT count(status) > 0 FROM `kotinfo` where tid = table_sitting_id and status = 'active')as isActive FROM table_sittings;";
	
	if( id != 0) {
		id_params = [id];
		var query = "SELECT table_sitting_id as sid , table_sitting_name as name, table_sitting_category, (SELECT count(status) > 0 FROM `kotinfo` where tid = table_sitting_id and status = 'active')as isActive FROM table_sittings WHERE table_sitting_category = ?;";
	}

	connection.query(query,id_params ,(err, results)=>{
	
		if(!err){
			return res.status(200).json(results);
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;