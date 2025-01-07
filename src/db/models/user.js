import { model, Schema } from 'mongoose';
import { emailRegex } from '../../constants/users.js';


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  
    email: {
        type: String,
        match: emailRegex,
      unique: true,
      required: false,
    },
    
    password: {
      type: String,
        required: true,
      minlength: 6,
        },
    
    
    createdAt: {
      type: Date,
        default: Date.now,
      required: true,
        },
    
    
    updatedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserCollection = model('User', userSchema);
