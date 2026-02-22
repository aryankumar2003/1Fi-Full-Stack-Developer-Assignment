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
    monthlyAmount: number;
    tenure: number;
    interestRate: number;
    cashback: number;
    cashbackDescription: string;
    isPopular: boolean;
}

export interface IProductDetail {
    product: IProduct;
    variants: IVariant[];
    emiPlans: IEmiPlan[];
}
