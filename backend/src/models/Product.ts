import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    category: string;
    brand: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        imageUrl: { type: String, required: true },
    },
    { timestamps: true }
);

ProductSchema.index({ slug: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
