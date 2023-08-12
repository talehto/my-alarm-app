import { Document, Schema, Model, model, Error } from 'mongoose'

export interface IRefreshToken extends Document {
  username: string
  token: string
}

interface IRefreshTokenModel extends Model<IRefreshToken> {
  findTokenByUsername(username: string): Promise<IRefreshToken>;
}

export const refreshTokenSchema: Schema<IRefreshToken> = 
  new Schema<IRefreshToken>({
  username: { type: String, required: true, unique: true, select: true },
  token: { type: String, required: true, select: true },
})

refreshTokenSchema.statics.findTokenByUsername = async function (username: string): Promise<IRefreshToken> {
  return await this.findOne({ username });
};

export const RefreshToken = model<IRefreshToken, IRefreshTokenModel>('RefreshToken', refreshTokenSchema)
