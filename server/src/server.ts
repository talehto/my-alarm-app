import express from 'express';
import cors from 'cors';
//import passport from 'passport';
//import passportJwt from 'passport-jwt';
// Needed to handle HTTP POST requests in Express.
import bodyParser from 'body-parser';
import compression from 'compression';
import config from "./config/config";
import {MongoDbConnectionParams, MongoDbConnection} from "./db/mongodb/mongoDbConnection"
import { AuthUserRoutes } from './router/authUserRoutes'

class Server {
  public app: express.Application

  constructor() {
    this.app = express()
    this.config()
    this.routes()
    this.openMongoDbConnection()
  }

  private config(): void {
    this.app.set('port', config.SERVER_PORT || 8080)
    // Compression decreases size of http bodies.
    this.app.use(compression)
    this.app.use(cors({ credentials: true }) )
    this.app.use(express.json())
    // TODO: Check whether extended values should be true or false.
    this.app.use(express.urlencoded({ extended: false }))
  }

  private routes(): void {
    let routeObj = new AuthUserRoutes();
    this.app.use("/", routeObj.getRouter());
  }

  private openMongoDbConnection() {
    const dbParams: MongoDbConnectionParams = {
      uri: config.MONGO_URI,
      connectionOptions: {
        keepAlive: true,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      }
    }
    MongoDbConnection.connect(dbParams)
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server is running at http://localhost:%d', this.app.get('port'))
    })
  }
}

//Creating a Server instance and start a server.
const server = new Server()
server.start()
