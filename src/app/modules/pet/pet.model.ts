// models/pet.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IPet } from './pet.interface';

const petSchema = new Schema<IPet & Document>(
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
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    description: {
      type: String,
      required: false,
    },
    neutered: {
      type: String,
      enum: ['Yes', 'No', 'N/A'],
      required: false,
    },
    vaccinated: {
      type: String,
      enum: ['Yes', 'No', 'N/A'],
      required: true,
    },
    chipped: {
      type: String,
      enum: ['Yes', 'No', 'N/A'],
      required: false,
    },
    weight: {
      type: String,
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

petSchema.index({ location: '2dsphere' });

// Create the model and export it
const Pet = mongoose.model<IPet & Document>('Pet', petSchema);
export default Pet;
