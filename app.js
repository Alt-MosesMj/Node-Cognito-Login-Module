require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express')
const app = express();
const routes = require('./routes/v1');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const httpContext = require('express-http-context');
const uuid = require('node-uuid');
const morgan = require('morgan');
const logger = require('./middlewares/logger');
const app_config = require('./json/app-config.json');
app.use(bodyParser.json());
app.use(httpContext.middleware);
const {sql : sequelize} = require("./db/config/db.config");
const { decryptToken } = require('./middlewares/auth');


app.use(function(req, res, next) {
      httpContext.set('reqId',uuid.v4());
      next();
});

//morgan http middleware
app.use(morgan(JSON.stringify({
      "component":app_config.COMPONENT_NAME,
      "method":':method',
      "timestamp":':date',
      "remote-addr":':remote-addr',
      "url":':url',
      "reqId":':reqId',
      "status":':status',
      "bytes":':res[content-length]',
      "response-time":':response-time'
    })));

//reqId to morgan middleware
morgan.token('reqId', function() {
      return httpContext.get('reqId');
});    

app.use(fileUpload());
//set security http headers
app.use(helmet());

app.use(cors());

app.options('*',cors());

app.use((req, res, next) => {
      // List of routes that should be public
      const publicRoutes = ['/public', '/v1/auth/login' , '/v1/auth/signup', '/v1/auth/forgot-password', '/v1/auth/confirm-forgot-password'];

      if (publicRoutes.includes(req.path)) {
            return next();
      }
      console.log(req.headers['authorization']);
      decryptToken(req, res, next);
});

app.use('/',routes);

app.get('/health', (req,res) => {
   res.status(httpStatus.OK).json({message:'I m normal'});
});

app.use((req,res) => {
      res.status(httpStatus.NOT_FOUND).send();
});

const initializeDatabase = async () => {
      try {
        await sequelize.authenticate();
        console.log('Connection established successfully.');
    
        await sequelize.sync();
        console.log('Database synchronized successfully.');
      } catch (error) {
        console.error('Unable to connect to the database or sync:', error);
        process.exit(1); // Exit the application if the connection or sync fails
      } 
};

initializeDatabase();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { logger.debug(`Server started on port ${PORT}) `)})