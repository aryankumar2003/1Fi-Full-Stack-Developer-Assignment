import { Request, Response } from 'express';
import Product from '../models/Product';
import Variant from '../models/Variant';
import EmiPlan from '../models/EmiPlan';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().lean();
        const productsWithDetails = await Promise.all(
            products.map(async (product) => {
                const variants = await Variant.find({ productId: product._id }).lean();
                const prices = variants.map((v) => v.price);
                return {
                    ...product,
                    variantCount: variants.length,
                    minPrice: prices.length > 0 ? Math.min(...prices) : 0,
                    maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
                };
            })
        );
        res.json({ success: true, data: productsWithDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug }).lean();
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const variants = await Variant.find({ productId: product._id }).lean();
        const emiPlans = await EmiPlan.find({ productId: product._id }).lean();
        res.json({ success: true, data: { product, variants, emiPlans } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};
