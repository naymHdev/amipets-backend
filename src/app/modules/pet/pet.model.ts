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
      type: [String],
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    neutered: {
      type: Boolean,
      required: true,
    },
    vaccinated: {
      type: Boolean,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    chip_number: {
      type: String,
      required: true,
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
    age: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pet_category: {
      type: String,
      enum: ['dog', 'cat', 'other'],
      required: true,
    },
    isAdopted: {
      type: Boolean,
      default: false,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);

const Pet = mongoose.model<IPet>('Pet', petSchema);
export default Pet;
