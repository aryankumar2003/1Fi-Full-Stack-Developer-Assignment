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
        <div className="min-h-screen">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-slate-950 to-violet-950/40 pointer-events-none" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-800/50 bg-blue-950/40 text-blue-300 text-xs font-semibold mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Mutual Fund-Backed EMI Plans
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                            Shop Premium{' '}
                            <span className="gradient-text">Smartphones</span>{' '}
                            on Easy EMI
                        </h1>
                        <p className="mt-4 text-slate-400 text-lg leading-relaxed">
                            Get the latest flagships with 0% interest EMI plans powered by smart mutual fund portfolios. No hidden charges.
                        </p>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-100">
                        {loading ? 'Loading...' : `${products.length} Products Available`}
                    </h2>
                    <div className="text-sm text-slate-500">Sorted by popularity</div>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl glass animate-pulse">
                                <div className="aspect-square bg-slate-800 rounded-t-2xl" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                                    <div className="h-6 bg-slate-800 rounded w-1/3 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-red-400 text-lg font-semibold">{error}</p>
                        <p className="text-slate-500 mt-2 text-sm">Make sure the backend server is running on port 5000.</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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
