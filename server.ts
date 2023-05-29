import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config/config';
import cookieParser from 'cookie-parser'
//import './catch' // initialize cache
import dbConnection from './config/dbConnection';
import routers from './router/index';
import { info, error, debug } from './config/logger';
//import Jobs from './jobs';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.listen(config.port, config.host, () => {
  if (dbConnection.connection) {
    info(`Server Listing At http://${config.host}:${config.port}`)
    routers(app);
  } else {
    process.exit(0)
  }
});

export default app;