import { model, Schema } from 'mongoose';
import { emailRegex } from '../../constants/users.js';
const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegex,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UsersCollection = model('User', usersSchema);
export const User = UsersCollection;
