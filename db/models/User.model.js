const { sql } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const app_config = require("../../json/app-config.json");

const UserModel = sql.define("user", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4 
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique : true,
    },
    password: {
      type: DataTypes.VIRTUAL,
      //Virtual means it wont be added as a column in db 
    },
    realmId:{
      type: DataTypes.STRING,
    },
    company_name:{
      type: DataTypes.STRING,
    },
    company_type:{
      type: DataTypes.STRING,
    },
    company_size:{
      type: DataTypes.STRING,
    },
    avg_invoices:{
      type: DataTypes.INTEGER,
    },
    plan : {
      type: DataTypes.STRING,
    },
    role : {
      type: DataTypes.STRING,
    },
    created_at: {
      type: 'TIMESTAMP',
      defaultValue: sql.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updated_at: {
      type: 'TIMESTAMP',
      defaultValue: sql.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  },{
    freezeTableName: true,
    timestamps: true, // This enables the createdAt and updatedAt fields
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    schema:app_config.DB_SCHEMA,
    tableName:'user'
  });
module.exports = UserModel;