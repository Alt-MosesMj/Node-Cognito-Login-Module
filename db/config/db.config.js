const { Sequelize } = require("sequelize");
const logger = require("../../middlewares/logger");
const sequelize = new Sequelize("","","", {
    dialect: 'postgres',
    port: 5432, 
    logging:(msg) => logger.debug(msg),
    logQueryParameters:true,
    pool: {
      max: 9,
      min: 0,
      idle: 10000
    }
});

sequelize.beforeConnect(async (config) => {
 config.host  = "";
 config.username = "";
 config.password =  "";
 config.database = "";
});



module.exports = {
  sql: sequelize,
}