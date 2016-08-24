var Sequelize = require('sequelize');
var db = require('../_db');

module.exports = db.define('page',{
    name: {
    	type: Sequelize.STRING,
      defaultValue: 'Untitled Page'
    },
    bgcolor: {
      type: Sequelize.STRING
    },
    bgshade: {
      type: Sequelize.STRING
    },
}, {
    getterMethods: {
      lastUpdated: function () {
        var dateStr = this.updatedAt.toString();
        return dateStr.slice(0,3) + ',' + dateStr.slice(3, 15);
      }
    }
});
