const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const User1 = sequelize.define('user1', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    right: {type: DataTypes.INTEGER, defaultValue: 0},//delete
    wrong: {type: DataTypes.INTEGER, defaultValue: 0},//delete
    key_API: {type: DataTypes.STRING, unique: true},// мб и не должно быть уникальным
})

module.exports = User1;
