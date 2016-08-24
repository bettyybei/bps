'use strict';
var router = require('express').Router();
module.exports = router;
var db = require('../../../db')
var Project = db.model('project')
var Page = db.model('page')
var Element = db.model('element')

router.get('/', function(req,res,next){
	Project.findAll({
		where: {
			userId: req.user.id
		},
		order: '"updatedAt" DESC',
		include: [Page]
	})
	.then(function(projects){
		res.send(projects);
	})
	.catch(next);
})

router.post('/create', function(req,res,next){
	Project.create(req.body)
	.then(function(project){
		project.setUser(req.user.id)
		res.json(project);
	})
	.catch(next);
})

router.get('/:id', function(req,res,next){
	Project.findAll({
		where: {
			id: req.params.id,
			userId: req.user.id
		},
		include: [Page]
	})
	.then(function(project){
		res.send(project);
	})
	.catch(next);
})

router.put('/:id', function(req,res,next){
	return Project.update(req.body, { where: {id: req.params.id} })
	.then(function(project){
		res.json(project);
	})
	.catch(next)
})

router.delete('/:id', function(req,res,next){
	return Project.findById(req.params.id)
	.then(function(project){
		Page.findAll({
			where:{
				projectId: project.id
			}
		})
		.then(function(pages){
			pages.map(function(page){
				Element.findAll({
					where: {
						pageId: page.id
					}
				})
				.then(function(elements){
					elements.forEach(function(element){
						element.destroy();
					})
				})
				.then(function(){
					page.destroy();
				})
			})
		})
		.then(function(){
			project.destroy();
		})
	})
	.then(function(){
		res.sendStatus(200);
	})
})