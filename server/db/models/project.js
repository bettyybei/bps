var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('project',{
    contents: {
        type: Sequelize.STRING
    },
    name: {
    	type: Sequelize.STRING
    }
});