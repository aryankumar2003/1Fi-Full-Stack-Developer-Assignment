import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEmiPlan extends Document {
    productId: Types.ObjectId;
    label: string;
    tenure: number;
    interestRate: number;
    cashback: number;
    cashbackDescription: string;
    isPopular: boolean;
}

const EmiPlanSchema = new Schema<IEmiPlan>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        label: { type: String, required: true },
        tenure: { type: Number, required: true },
        interestRate: { type: Number, required: true, default: 0 },
        cashback: { type: Number, default: 0 },
        cashbackDescription: { type: String, default: '' },
        isPopular: { type: Boolean, default: false },
    },
    { timestamps: true }
);

EmiPlanSchema.index({ productId: 1 });

export default mongoose.model<IEmiPlan>('EmiPlan', EmiPlanSchema);
