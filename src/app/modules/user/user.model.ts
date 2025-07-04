// models/pet.model.ts
import mongoose, { Schema } from 'mongoose';
import { IMyPet, IPetAdopt } from './user.interface';

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

const PetAdoptSchema = new Schema<IPetAdopt>(
  {
    adopted_pet: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    adopter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const MyPet = mongoose.model<IMyPet>('MyPet', MyPetSchema);

export const PetAdopt = mongoose.model<IPetAdopt>('PetAdopt', PetAdoptSchema);
