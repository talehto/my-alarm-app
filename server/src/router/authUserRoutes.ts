import { Router } from 'express'
import { AuthUserController } from '../controllers/authUserController'

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
    
    this.router.post('/signup', AuthUserController.signupUser);
    
    this.router.post('/login', AuthUserController.loginUser);

    this.router.post('/refresh', AuthUserController.refreshToken);
  }
} 
