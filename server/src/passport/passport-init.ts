import passport from 'passport'
import passportLocal from 'passport-local'
import passportJwt from 'passport-jwt'
import { User } from '../db/mongodb/models/userModel'
import config from "../config/config";

const LocalStrategy = passportLocal.Strategy
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

passport.use('register',
  new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
    try{
      console.log("register LocalStrategy called")
      const user = await User.findByUsername(username)
      if(user){
        return done(undefined, false, { message: `username ${username} already exists.` })
      }
      
      const newUser = User.create({
        username: username,
        password: password
      })

      return done(null, user)
    }catch(err){
      console.log("register LocalStrategy catch block")
      return done(err)
    }    
  })
)

passport.use('login',
  new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
    try{
      const user = await User.findByUsername(username)
      if(!user){
        return done(undefined, false, { message: `username ${username} is not found.` })
      }
      
      console.log("passport-init login: " + user)
      const retValue = await user.checkPassword(password)
      console.log("passport-init login, retValue: " + retValue);
      if(!retValue){
        return done(undefined, false, { message: 'Invalid username or password.' })
      }else{
        //Successful case.
        console.log("passport-init login successful case");
        return done(undefined, user)
      }
    }catch(err){
      console.log("passport-init login, error caught " + err);
      return done(err)
    }    
  })
)

passport.use('jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET,
      algorithms: ["HS256"],
    },
    async function (jwtToken, done) {
      try{
        const user = await User.findByUsername(jwtToken.username)
        if (user) {
          return done(undefined, user, jwtToken)
        } else {
          return done(undefined, false)
        }
      }catch(err){
        return done(err, false)
      }
    }
  )
)
