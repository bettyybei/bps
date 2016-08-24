var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('project',{
    name: {
    	type: Sequelize.STRING,
      defaultValue: 'Untitled Project'
    }
}, {
  getterMethods: {
    lastUpdated: function () {
      var dateStr = this.updatedAt.toString();
      return dateStr.slice(0,3) + ',' + dateStr.slice(3, 15);
    }
  }
});