/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Project = db.model('project');
var Page = db.model('page');
var Element = db.model('element');
var Promise = require('sequelize').Promise;

var seedUsers = function () {

    var users = [
        {
            firstName: 'Test',
            lastName: 'Name',
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            firstName: 'Barack',
            lastName: 'Obama',
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);
};

var seedProjects = function(){
    var projects = [
        {
            userId: '2',
            name: 'Obama\'s 1st Project'
        },
        {
            userId: '2',
            name: 'Obama\'s 2nd Project'
        }
    ]
   var creatingProjects = projects.map(function (projectObj) {
        return Project.create(projectObj);
    });

    return Promise.all(creatingProjects);
};

var seedPages = function(){
    var pages = [
        {
            projectId: '4',
            name: 'Obama\'s 1st Page',
            bgcolor: 'light-blue',
            bgshade: 'lighten-4'
        },
        {
            projectId: '4',
            name: 'Obama\'s 2nd Project',
            bgcolor: 'light-blue',
            bgshade: 'lighten-4'
        }
    ]
   var creatingPages = pages.map(function (pageObj) {
        return Page.create(pageObj);
    });

    return Promise.all(creatingPages);
};

var seedElements = function(){
    var elements = [
        {
            type: 'navbar',
            color: 'red',
            shade: 'lighten-1',
            pageId: '1'
        },
        {
            type: 'logo',
            top: '100',
            left: '300',
            width: '50',
            height: '50',
            pageId: '1'
        },
        {
            type: 'div',
            top: '300',
            left: '100',
            width: '200',
            height: '200',
            pageId: '1'
        },
        {
            type: 'button',
            top: '400',
            left: '100',
            width: '200',
            height: '50',
            color: 'green',
            shade: 'darken-1',
            pageId: '2'
        },
        {
            type: 'image',
            top: '320',
            left: '120',
            width: '150',
            height: '150',
            url: 'https://pbs.twimg.com/profile_images/682333466218774529/R6xUsIqq.jpg',
            pageId: '2'
        },

    ]
    var creatingElements = elements.map(function (elementObj) {
        return Element.create(elementObj);
    });

    return Promise.all(creatingElements);
};

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function () {
        return seedProjects();
    })
    .then(function(){
        return seedPages();
    })
    .then(function () {
        return seedElements();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
