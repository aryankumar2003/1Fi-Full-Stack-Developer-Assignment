export interface IProduct {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    brand: string;
    imageUrl: string;
    variantCount?: number;
    minPrice?: number;
    maxPrice?: number;
    createdAt: string;
    updatedAt: string;
}

export interface IVariant {
    _id: string;
    productId: string;
    label: string;
    storage: string;
    color: string;
    mrp: number;
    price: number;
    images: string[];
}

export interface IEmiPlan {
    _id: string;
    productId: string;
    label: string;
    tenure: number;
    interestRate: number;
    cashback: number;
    cashbackDescription: string;
    isPopular: boolean;
    monthlyAmount: number; // computed by backend; scaled by frontend per selected variant
}

export interface IProductDetail {
    product: IProduct;
    variants: IVariant[];
    emiPlans: IEmiPlan[];
}
