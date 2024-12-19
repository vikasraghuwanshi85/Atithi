require('dotenv').config();

function checkRole(req, res, next) {
	console.log(res.locals.role, '== ', process.env.ROLE);
	if (res.locals.role == process.env.ROLE){
		res.sendStatus(401)
	}
	else{
		next()
	}
}

module.exports = { checkRole: checkRole }