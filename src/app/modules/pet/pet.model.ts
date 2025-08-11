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
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: {
        type: String,
        required: false,
      },
    },
    description: {
      type: String,
      required: false,
    },
    neutered: {
      type: Boolean,
      required: false,
    },
    vaccinated: {
      type: Boolean,
      required: true,
    },
    weight: {
      type: String,
      required: false,
    },
    chipped: {
      type: Boolean,
      required: false,
    },
    chip_number: {
      type: String,
      required: false,
    },
    breed: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pet_category: {
      type: String,
      enum: ['dog', 'cat', 'both'],
      required: true,
    },
    isAdopted: {
      type: Boolean,
      default: false,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Pet = mongoose.model<IPet>('Pet', petSchema);
export default Pet;
