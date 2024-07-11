require("dotenv").config();

const winston = require('winston');
const httpContext = require('express-http-context');

var getReqId = function() {
  const reqid = httpContext && httpContext.get('reqId') ? httpContext.get('reqId') :null;
  return reqid;
};
const errorStackFormat = winston.format(info => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message
    })
  }
  return info
})
const winston_logger = winston.createLogger({
  level: 'debug',
  defaultMeta: { component: 'user-profile-service',timestamp:new Date()},
  format: winston.format.json(
    errorStackFormat()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

const optionsFormat = function (options) {
  if(options == null || options == undefined)
  options = {};
  options['reqId'] = getReqId();
    return options;
}


var logger = {
  log: function(message,options) {
    options = optionsFormat(options);
    winston_logger.log(message,options);
  },
  error: function(message,options,error) {
    options = optionsFormat(options);
    options['stack_trace'] = error;
    winston_logger.error(message,options);
  },
  warn: function(message,options) {
    options = optionsFormat(options);
    winston_logger.warn(message,options);
  },
  verbose: function(message,options) {
    options = optionsFormat(options);
    winston_logger.verbose(message,options);
  },
  info: function(message,options) {
     options = optionsFormat(options);
     winston_logger.info(message,options);
  },
  debug: function(message,options) {
    options = optionsFormat(options);
    winston_logger.debug(message,options);
  },
  silly: function(message,options) {
    options = optionsFormat(options);
    winston_logger.silly(message,options);
  }
};

module.exports = logger;