import express from 'express';
import cors from 'cors';
import passport from 'passport';
// This is needed for an initialization of the passport.
const passportSetup = require("./passport/passport-init");
// Needed to handle HTTP POST requests in Express.
//import bodyParser from 'body-parser';
import compression from 'compression';
import config from "./config/config";
import {MongoDbConnectionParams, MongoDbConnection} from "./db/mongodb/mongoDbConnection"
import { AuthUserRoutes } from './router/authUserRoutes'
import { SecureUserRoutes } from './router/secureUserRoutes'

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
    //TODO: Enabling compression, for some reason, causes that
    // all requests is left for a pending state. 
    // Compression decreases size of http bodies.
    //this.app.use(compression)
    //TODO: Check whether this is needed
    this.app.use(cors({ credentials: true }) )
    this.app.use(express.json())
    // TODO: Check whether extended values should be true or false.
    this.app.use(express.urlencoded({ extended: false }))
  }

  private routes(): void {
    this.app.use(passport.initialize());

    let authRouteObj = new AuthUserRoutes();
    let secureRouteObj = new SecureUserRoutes();
    this.app.use("/auth", authRouteObj.getRouter());
    this.app.use("/user", secureRouteObj.getRouter());

    // this.app.get("/huhuu", (req, res) => {
    //   console.log("here we go")  
    //   res.send("Hello 2")
    // })
    console.log("routes added")
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
