import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { User } from "../db/mongodb/models/userModel"

//TODO: Remove this file.
export class AuthUserController {

  jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }

  public async registerUser(req: Request, res: Response) {
    
  }
}
