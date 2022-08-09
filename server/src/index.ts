import express, { Express, Request, Response } from 'express';
//import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import config from "./config";


//dotenv.config();

const app: Express = express();
const port = config.SERVER_PORT || 8080;

app.get('/', (req: Request, res: Response):void => {
  res.send('Express + TypeScript Server is up and running');
});

app.listen(port, ():void => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
