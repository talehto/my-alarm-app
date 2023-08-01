import { Router } from 'express'
import passport from 'passport'

export class SecureUserRoutes {

  router: Router

  constructor() {
    this.router = Router()
    this.routes()
  }

  public getRouter(): Router {
    return this.router;
  }

  private routes(): void {
    this.router.all("*", async (req, res, next) => {
      console.log("* route called");
      passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if(err){
          console.log("error in the secure route: " + err);
          return next(err);
        }
        if(!user){
          console.log("no user in the secure route.");
          return next(new Error("no user in the secure route."));
        }else{
          req.user = user;
          return next()
        }
      })
      (req, res, next);
    })

    this.router.get("/test", (req, res, next) => {
      res.status(200).json({ success: true, msg: "You are successfully in the user/test route!" });
    })
  }

}
