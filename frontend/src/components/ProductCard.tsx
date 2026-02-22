import { Link } from 'react-router-dom';
import { IProduct } from '../types';

interface Props {
    product: IProduct;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const getBrandBg = (brand: string) => {
    const map: Record<string, string> = {
        Apple: 'bg-gray-100 text-gray-700',
        Samsung: 'bg-blue-50 text-blue-700',
        OnePlus: 'bg-red-50 text-red-700',
    };
    return map[brand] || 'bg-violet-50 text-violet-700';
};

const ProductCard = ({ product }: Props) => {
    const priceText =
        product.minPrice === product.maxPrice
            ? formatPrice(product.minPrice ?? 0)
            : `${formatPrice(product.minPrice ?? 0)} – ${formatPrice(product.maxPrice ?? 0)}`;

    return (
        <Link
            to={`/products/${product.slug}`}
            className="group block card card-hover overflow-hidden"
        >
            {/* Image */}
            <div className="relative bg-gray-50 aspect-square overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getBrandBg(product.brand)}`}>
                        {product.brand}
                    </span>
                </div>
                <div className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-white/90 text-gray-500 backdrop-blur-sm border border-gray-200">
                    {product.variantCount} variant{product.variantCount !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>

                <div className="mt-3 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
                        <p className="text-base font-extrabold text-gray-900">{priceText}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                            0% EMI
                        </p>
                    </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-violet-600 text-xs font-semibold">
                    <span>View EMI Plans</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
