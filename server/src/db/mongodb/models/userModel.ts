import { Document, Schema, Model, model, Error } from 'mongoose'
import bcrypt from 'bcrypt';

export interface IUser{
  username: string
  password: string
}

export interface IUserDocument extends IUser, Document{
  checkPassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  findByUsername(username: string): Promise<IUserDocument>;
}

export const userSchema: Schema<IUserDocument> = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: true },
})

userSchema.pre<IUserDocument>('save', async function save(next) {
  const user = this

  try{
    //Password hashing is done only if password has been changed.
    if(!this.isModified("password")){
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    user.password = hashedPassword
    return next()
  } catch(err) {
    console.log("userMolel error. Error: " + err)
    const tmpErr: Error = err as Error;
    return next(tmpErr);
  }
})

userSchema.methods.checkPassword = async function checkPassword(candidatePassword: string): Promise<boolean> {
  console.log("checkPassword: candidatePassword: " + candidatePassword)
  console.log("checkPassword: hashed password: " + this.password)
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
}

userSchema.statics.findByUsername = async function (username: string): Promise<IUserDocument> {
  return await this.findOne({ username });
};

export const User = model<IUserDocument, IUserModel>('User', userSchema)

