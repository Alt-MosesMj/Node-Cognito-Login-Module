const { DataTypes } = require('sequelize');
const { sql } = require('../config/db.config'); // Adjust the path as necessary
const UserModel = require('./User.model');

const UserManagement = sql.define('UserManagement', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        unique : true,
        references: {
                    model: {
                        tableName: 'user',
                        schema: 'public'
                    },
                    key: 'email'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    plan: {
        type: DataTypes.STRING
    },
    realmid: {
        type: DataTypes.STRING
    },
    access_token: {
        type: DataTypes.TEXT
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    date_of_signup: {
        type: DataTypes.DATE
    },
    initial_data_pull: {
        type: DataTypes.BOOLEAN
    },
    last_data_pull: {
        type: DataTypes.DATE
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: "user_management",
    schema: "public",
});


module.exports = UserManagement;
