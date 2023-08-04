import bcrypt from 'bcryptjs'
import passport from 'passport'
import * as jwt from 'jsonwebtoken'
import config from "../config/config";
import { NextFunction, Request, Response } from 'express'
import { User } from "../db/mongodb/models/userModel"

export class AuthUserController {

  jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }

  public static async signupUser(req: Request, res: Response) {
    console.log("signup router called")
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
  }

  // We have a custom callback in the login route. Custom callback
  // creates a secure token.
  public static async loginUser(req: Request, res: Response, next: NextFunction){
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
                expiresIn: config.JWT_EXPIRES_TIME
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
}
