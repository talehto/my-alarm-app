import { Router } from 'express'
import passport from 'passport'
import * as jwt from 'jsonwebtoken'
//import { AuthUserController } from '../controllers/authUserController'
import config from "../config/config";

export class AuthUserRoutes {

  router: Router
  //public authUserController: AuthUserController = new AuthUserController(config.JWT_SECRET)

  constructor() {
    this.router = Router()
    this.routes()
  }

  public getRouter(): Router {
    return this.router;
  }

  private routes(): void {
    this.router.post('/register',
    //TODO: Is failureRedirect option needed. 
      passport.authenticate('register', { session: false }),
        async (req, res, next) => {
          res.json({
            message: "Signup successful",
            user: req.user
          })
        }
      );
    
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

                req.login(
                  user,
                  { session: false },
                  async (error) => {
                    if (error) return next(error);

                    //TODO: Add algorithm and expiresIn to config parameters.
                    const token = jwt.sign({ username: user.username }, config.JWT_SECRET, {
                      algorithm: 'HS256',
                      expiresIn: '60s' // if ommited, the token will not expire
                      } );
                    return res.json({ token });
                  }
                );
              } catch (error) {
                console.log("login, error occurred")
                return next(error);
              }
            }
          )(req, res, next);
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
