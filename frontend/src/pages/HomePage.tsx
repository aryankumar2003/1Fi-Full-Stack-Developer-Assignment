import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { IProduct } from '../types';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch(() => setError('Failed to load products. Is the backend running?'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Mutual Fund-Backed EMI Plans
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
                            Shop Premium{' '}
                            <span className="gradient-text">Smartphones</span>{' '}
                            on Easy EMI
                        </h1>
                        <p className="mt-4 text-gray-500 text-lg leading-relaxed">
                            Get the latest flagships with 0% interest EMI plans powered by smart mutual fund portfolios. No hidden charges.
                        </p>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        {loading ? 'Loading...' : `${products.length} Products Available`}
                    </h2>

                </div>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="aspect-square bg-gray-100 rounded-t-xl" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    <div className="h-6 bg-gray-100 rounded w-1/3 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-red-500 text-lg font-semibold">{error}</p>
                        <p className="text-gray-400 mt-2 text-sm">Make sure the backend server is running on port 5000.</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
