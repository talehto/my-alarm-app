import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express'

export class AuthUserController {

  public async registerUser(req: Request, res: Response) {
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).send("Registration failed due to missing user data");
    }

    const existingUser = await getUserByEmail(email);
  }
}
