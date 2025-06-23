// models/pet.model.ts
import mongoose, { Schema } from 'mongoose';
import { IMyPet } from './user.interface';

const MyPetSchema = new Schema<IMyPet>(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    pet_image: {
      type: String,
      required: false,
    },
    chip_number: {
      type: String,
      required: true,
      unique: true,
    },
    breed: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const MyPet = mongoose.model<IMyPet>('MyPet', MyPetSchema);
export default MyPet;
