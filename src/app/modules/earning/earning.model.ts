import { Schema, model } from 'mongoose';
import { IIncome } from './earning.interface';

const incomeSchema = new Schema<IIncome>(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Income = model<IIncome>('Income', incomeSchema);
