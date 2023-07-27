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
      
      if(!user.checkPassword(password)){
        return done(undefined, false, { message: 'Invalid username or password.' })
      }else{
        //Successful case.
        return done(undefined, user)
      }
    }catch(err){
      return done(err)
    }    
  })
)

passport.use('jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET,
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
