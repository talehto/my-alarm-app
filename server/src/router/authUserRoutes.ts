import { Router } from 'express'
import { AuthUserController } from '../controllers/authUserController'

export class AuthUserRoutes {

  router: Router
  public authUserController: AuthUserController = new AuthUserController()

  constructor() {
    this.router = Router()
    this.routes()
  }

  private routes(): void {
    // For TEST only ! In production, you should use an Identity Provider !!
    this.router.post('/register', this.authUserController.registerUser)
    this.router.post('/login', this.authUserController.loginUser)
  }

}