var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Projects route', function(){

	var User, Project, app, agent, project, user;

	beforeEach('Sync DB', function(){
		return db.sync({ force:true });
	});

	beforeEach('Create app', function(){
		app = require('../../../server/app')(db);
        Project = db.model('project');
        User = db.model('user');
        agent = supertest.agent(app);
	})

	var projectInfo = {
		contents: 'yoyo',
		name: 'oyoy',
	};

	var userInfo = {
			firstName: 'Paul',
			lastName: 'Hsu',
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
	};

	beforeEach('Create user and project', function(done){
		return User.create(userInfo)
		.then(newUser => {
			user = newUser
		})
		.then(function(){
			Project.create(projectInfo)
			.then(function(newProject){
				newProject.setUser(user)
				.then(function(pro){
					project = pro
					done();
				})
			})
		})
	})

	beforeEach('Agent login', function(done){
		agent.post('/login').send(userInfo).end(done);
	})
	afterEach(function(){
		return db.sync({ force:true })
	})
	describe('api/projects', function(){

		it('Get all projects', function(done){

			agent.get('/api/projects')
			.end(function(err,res){
				if(err) return done(err);
				expect(res.body).to.be.an('array');
				expect(res.body).to.have.length(1);
				done();
			})
		})

	})
})