import axios from 'axios';
import { IProduct, IProductDetail } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
});

export const fetchProducts = async (): Promise<IProduct[]> => {
    const response = await api.get<{ success: boolean; data: IProduct[] }>('/products');
    return response.data.data;
};

export const fetchProductBySlug = async (slug: string): Promise<IProductDetail> => {
    const response = await api.get<{ success: boolean; data: IProductDetail }>(`/products/${slug}`);
    return response.data.data;
};
