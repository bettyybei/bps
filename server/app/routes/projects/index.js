'use strict';
var router = require('express').Router();
module.exports = router;
var db = require('../../../db')
var Project = db.model('project')
var User = db.model('user')

router.get('/', function(req,res,next){
	Project.findAll({
		where: {
			userId: req.user.id
		}
	})
	.then(function(projects){
		res.send(projects);
	})	
})

router.post('/create', function(req,res,next){
	Project.create(req.body)
	.then(function(project){
		project.setUser(req.user.id)
		res.json(project);
	})
})

router.put('/:id', function(req,res,next){
	return Project.update(req.body)
	.then(function(project){
		res.json(project);
	})
})