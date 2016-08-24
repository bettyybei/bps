'use strict';
var router = require('express').Router();
var Project = require('../../../db/models/project')
var Element = require('../../../db/models/element')
module.exports = router;

router.get('/:id', function(req,res,next){
	return Element.findAll({
		where:{
			projectId: req.params.id
		}
	})
	.then(function(elements){
		res.json(elements);
	})
	.catch(next);
})

router.post('/:id', function(req,res,next){
	return Element.create(req.body)
	.then(function(element){
		element.setPage(req.params.id)
		res.json(element);
	})
	.catch(next);
})

router.put('/:id', function(req,res,next){
	return Element.update(req.body)
	.then(function(element){
		res.json(element);
	})
	.catch(next);
})

router.delete('/:id', function(req,res,next){
	return Element.findAll({
		where:{
			pageId: req.params.id
		}
	})
	.then(function(elements){
		return elements.map(element=>element.destroy());
	})
	.then(function(){
		res.sendStatus(200);
	})
	.catch(next);
})