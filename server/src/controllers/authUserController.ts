import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { User } from "../db/mongodb/models/userModel"

export class AuthUserController {

  jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }

  public async registerUser(req: Request, res: Response) {
    const { password, username } = req.body;
    
    if ( !password || !username ) {
      return res.status(400).send("Registration failed due to missing user data");
    }

    const user = User.findByUsername(username)
    if( user !== null ){
      return res.status(400).send("Username already registered");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    await User.create({
      username: username,
      password: hashedPassword,
    })

    const token = jwt.sign({ username: username, scope: req.body.scope }, this.jwtSecret, { expiresIn: '1800s' })
    res.status(200).send({ token: token })
  }
}
