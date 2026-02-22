import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVariant extends Document {
    productId: Types.ObjectId;
    label: string;
    storage: string;
    color: string;
    mrp: number;
    price: number;
    images: string[];
}

const VariantSchema = new Schema<IVariant>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        label: { type: String, required: true },
        storage: { type: String, required: true },
        color: { type: String, required: true },
        mrp: { type: Number, required: true },
        price: { type: Number, required: true },
        images: [{ type: String }],
    },
    { timestamps: true }
);

VariantSchema.index({ productId: 1 });

export default mongoose.model<IVariant>('Variant', VariantSchema);
