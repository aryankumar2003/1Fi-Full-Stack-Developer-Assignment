import { Link } from 'react-router-dom';
import { IProduct } from '../types';

interface Props {
    product: IProduct;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const getBrandColor = (brand: string) => {
    const map: Record<string, string> = {
        Apple: 'from-slate-400 to-slate-600',
        Samsung: 'from-blue-400 to-cyan-600',
        OnePlus: 'from-red-400 to-orange-600',
    };
    return map[brand] || 'from-blue-400 to-violet-600';
};

const ProductCard = ({ product }: Props) => {
    const priceText =
        product.minPrice === product.maxPrice
            ? formatPrice(product.minPrice ?? 0)
            : `${formatPrice(product.minPrice ?? 0)} – ${formatPrice(product.maxPrice ?? 0)}`;

    return (
        <Link
            to={`/products/${product.slug}`}
            className="group block rounded-2xl overflow-hidden glass hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/40 hover:-translate-y-1"
        >
            {/* Image */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 aspect-square overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${getBrandColor(product.brand)} text-white shadow`}
                    >
                        {product.brand}
                    </span>
                </div>
                <div className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-slate-900/80 text-slate-300 backdrop-blur-sm">
                    {product.variantCount} variant{product.variantCount !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Info */}
            <div className="p-5">
                <h3 className="text-base font-bold text-slate-100 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{product.category}</p>

                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-slate-500 mb-0.5">Starting from</p>
                        <p className="text-lg font-extrabold text-slate-100">{priceText}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded-lg border border-emerald-800/50">
                            0% EMI Available
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-blue-400 text-xs font-medium">
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
