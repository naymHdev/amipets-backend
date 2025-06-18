// models/pet.model.ts
import mongoose, { Schema } from 'mongoose';
import { IPet } from './pet.interface';

const petSchema = new Schema<IPet>(
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
    date_of_birth: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Pet = mongoose.model<IPet>('Pet', petSchema);
export default Pet;
