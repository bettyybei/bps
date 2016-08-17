'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');
var Project = require('./project')
var db = require('../_db');

module.exports = db.define('user', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING
        
    },
    salt: {
        type: Sequelize.STRING
    },
/*    status: {
        type: Sequelize.STRING,
         defaultValue: 'guest'
    },*/
    twitter_id: {
        type: Sequelize.STRING
    },
    google_id: {
        type: Sequelize.STRING
    }
    // facebook_id: {
    //     type: Sequelize.STRING
    // }
}, {
    instanceMethods: {
        sanitize: function () {
            return _.omit(this.toJSON(), ['password', 'salt']);
        },
        correctPassword: function (candidatePassword) {
            return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
        }/*,
        changeStatus: function (newStatus) {
            newStatus = newStatus.toLowerCase();
            if (newStatus === 'guest') return;

            return this.update({ status: newStatus});
        }*/
    },
    classMethods: {
        generateSalt: function () {
            return crypto.randomBytes(16).toString('base64');
        },
        encryptPassword: function (plainText, salt) {
            var hash = crypto.createHash('sha1');
            hash.update(plainText);
            hash.update(salt);
            return hash.digest('hex');
        }
    },
    hooks: {
        beforeCreate: function (user) {
                user.salt = user.Model.generateSalt();
                user.password = user.Model.encryptPassword(user.password, user.salt);
        },
        beforeUpdate: function (user) {
            if (user.changed('password')) {
                user.password = user.Model.encryptPassword(user.password, user.salt);
            }
        },
        afterCreate: function (user) {
            console.log(user, "flaka")
            
            Project.create({userId: user.id})
            
            
            
        }
    }
});
