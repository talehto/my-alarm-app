import { Router } from 'express'
import passport from 'passport'
import * as jwt from 'jsonwebtoken'
import config from "../config/config";
import { User } from '../db/mongodb/models/userModel'

export class AuthUserRoutes {

  router: Router

  constructor() {
    this.router = Router()
    this.routes()
  }

  public getRouter(): Router {
    return this.router;
  }

  private routes(): void {
    
    this.router.post('/register', async (req, res) => {
      console.log("register router called")
      try{
        const { username, password } = req.body;
        const user = await User.findByUsername(username)
        if(user){
          res.status(400).send(`username ${username} already exists.`);
          return;
        }

        const newUser = User.create({
          username: username,
          password: password
        })

        res.status(200).send(`User ${username} has been created successfully.`);
      }catch(err){
        res.status(500).send("Unexpected error in the login: " + err);
      }
    });
    
    // We have a custom callback in the login route. Custom callback
    // creates a secure token.
    this.router.post('/login', 
      async (req, res, next) => {
        passport.authenticate(
          'login',
          async (err: any, user: any, info: any) => {
            try {
              if (err || !user) {
                const error = new Error('login, An error occurred: ' + err);
                return next(error);
              }

              req.login( user, { session: false }, async (error) => {
                  if (error) return next(error);

                  const token = jwt.sign({ username: user.username }, config.JWT_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: config.JWT_EXPIRES_TIME  // if ommited, the token will not expire
                    } );
                  return res.json({ token });
                }
              );
            } catch (error) {
              console.log("login, error occurred")
              return next(error);
            }
          }
        )
        (req, res, next);
      }
    );

    this.router.get('/user',
      passport.authenticate('jwt', { session: false }), 
        (req, res, next) => {
          res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!" });
      }
    );
  }
} 
