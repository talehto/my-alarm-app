import passport from 'passport'
import * as jwt from 'jsonwebtoken'
import config from "../config/config";
import { NextFunction, Request, Response } from 'express'
import { User, IUser } from "../db/mongodb/models/userModel"
import { RefreshToken } from '../db/mongodb/models/refreshTokenModel'

//NOTE: I didn't get this work as a static inner class.
// In the inner class case, defining this class as a return value 
//didn't work.
class Token {
  token: string;
  refreshToken: string;

  constructor(token: string, refreshToken: string){
    this.token = token;
    this.refreshToken = refreshToken;
  }
};

export class AuthUserController {

  public static async signupUser(req: Request, res: Response) {
    console.log("signup router called")
    try{
      //const { username, password } = req.body;
      const userObj: IUser = req.body;
      const user = await User.findByUsername(userObj.username)
      if(user){
        res.status(400).send(`username ${userObj.username} already exists.`);
        return;
      }

      // Saving an user to the db.
      User.create(userObj)

      res.status(200).send(`User ${userObj.username} has been created successfully.`);
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

              const retToken: Token = await AuthUserController.generateTokens(user.username);
              //return res.json({ token: retToken.token, refreshToken: retToken.refreshToken });
              return res.json(retToken);
            }
          );
        } catch (error) {
          console.log("login, error occurred: " + error)
          return next(error);
        }
      }
    )(req, res, next);
  }

  // Logic of the refreshing a token.
  // See https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
  // 1. A new refresh and actual token is returned each time when this
  //    method is called.
  // 2. A user must pass previous refresh token when calling this method. It is checked
  //    whether given refresh token matches with refresh token retrieved from the db.
  //    New tokens are not returned if given refresh token does not match with db value. 
  //    Expiration time invalidates existing tokens. 
  public static async refreshToken(req: Request, res: Response, next: NextFunction){
    passport.authenticate(
      'jwt-refresh', { session: false }, async (err: any, user: any, info: any) => {
        try {
          if(err){
            const error = new Error('refreshToken, incorrect or expired refresh token: ' + err);          
            return next(error);
          }
          const retToken: Token = await AuthUserController.generateTokens(user.username);
          return res.json(retToken);
        }catch (error) {
          console.log("refreshToken, error occurred: " + error)
          return next(error);
        }
      }
      )(req, res, next);
  }

  private static async generateTokens(username: string): Promise<Token>{
    const token = jwt.sign({ username: username }, config.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: config.JWT_EXPIRES_TIME
      } );
    
    const refreshToken = jwt.sign({ username: username }, config.JWT_REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_TIME
      } );
    
    //Updating a new refresh token to the db.
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    const filter = { username: username };
    const update = { token: refreshToken };
    await RefreshToken.findOneAndUpdate(filter, update, options);
    
    return new Token(token, refreshToken);
  }
}
