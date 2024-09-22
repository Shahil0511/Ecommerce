import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  availableMoney: number;
  // purchagedItem : string[]
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    availableMoney: { trpe: Number, default: 5000 },
//   purchasedItem:
});

export const UserModel =model<IUser>("user", UserSchema)
