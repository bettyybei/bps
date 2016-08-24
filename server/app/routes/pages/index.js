'use strict';
var router = require('express').Router();
module.exports = router;
var db = require('../../../db')
var Page = db.model('page')
var Element = db.model('element')

router.get('/:projectId/page', function(req,res,next){
	Page.findAll({
		where: {
			projectId: req.params.projectId
		},
		order: '"updatedAt" DESC'
	})
	.then(function(pages){
		console.log('back',pages)
		res.send(pages);
	})
	.catch(next);
})

router.get('/page/:pageId/getAllPages', function(req,res,next){
	Page.findOne({
		where: {
			id: req.params.pageId
		}
	})
	.then(function(page){
		Page.findAll({
			where:{
				projectId: page.projectId
			}
		})
		.then(function(pages){
			res.send(pages);
		})	
	})
	.catch(next);
})

router.post('/:projectId/create', function(req,res,next){
	Page.create(req.body)
	.then(function(page){
		page.setProject(req.params.projectId)
		res.json(page);
	})
	.catch(next);
})

router.get('/:projectId/page/:id', function(req,res,next){
	Page.findAll({
		where: {
			projectId: req.params.projectId,
			id: req.params.id
		},
		include: [Element]
	})
	.then(function(page){
		res.send(page);
	})
	.catch(next);
})

router.put('/:projectId/page/:id', function(req,res,next){
	return Page.update(req.body, {
		where: {
			id: req.params.id,
			projectId: req.params.projectId
		}})
	.then(function(page){
		res.json(page);
	})
	.catch(next)
})

router.delete('/:projectId/page/:id', function(req,res,next){
	return Page.findOne({
		where: {
			id: req.params.id,
			projectId: req.params.projectId
		}
	})
	.then(function(page){
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
	.then(function(){
		res.sendStatus(200);
	})
	.catch(next)
})