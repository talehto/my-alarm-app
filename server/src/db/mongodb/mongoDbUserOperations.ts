import { Model } from 'mongoose'
import { IUser } from "./models/userModel"

export class MongoDbUserOperations {

  model: Model<IUser>;
  
  constructor(model: Model<IUser>){
    this.model = model
  }

  public async getUserByName(username: string): Promise<IUser | null>{
    return await this.model.findOne( { 'username': username } );
  }
}
