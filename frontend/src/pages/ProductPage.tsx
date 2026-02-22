import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductBySlug } from '../services/api';
import { IEmiPlan, IProductDetail, IVariant } from '../types';
import VariantSelector from '../components/VariantSelector';
import EmiPlanCard from '../components/EmiPlanCard';

const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const ProductPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<IProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<IEmiPlan | null>(null);
    const [activeImage, setActiveImage] = useState<string>('');
    const [proceeded, setProceeded] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(null);
        fetchProductBySlug(slug)
            .then((d) => {
                setData(d);
                if (d.variants.length > 0) {
                    setSelectedVariant(d.variants[0]);
                    setActiveImage(d.variants[0].images[0] || d.product.imageUrl);
                }
                const popular = d.emiPlans.find((p) => p.isPopular);
                setSelectedPlan(popular ?? (d.emiPlans[0] || null));
            })
            .catch(() => setError('Product not found or server error.'))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleVariantSelect = (variant: IVariant) => {
        setSelectedVariant(variant);
        setActiveImage(variant.images[0] || data?.product.imageUrl || '');
    };

    const handleProceed = () => {
        if (!selectedPlan || !selectedVariant) return;
        setProceeded(true);
        setTimeout(() => setProceeded(false), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square bg-slate-800 rounded-3xl" />
                    <div className="space-y-4">
                        <div className="h-8 bg-slate-800 rounded w-3/4" />
                        <div className="h-5 bg-slate-800 rounded w-1/2" />
                        <div className="h-12 bg-slate-800 rounded w-1/3 mt-6" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-red-400 text-lg font-semibold">{error || 'Product not found'}</p>
                    <Link to="/" className="mt-4 inline-block text-blue-400 hover:text-blue-300 underline text-sm">
                        ← Browse all products
                    </Link>
                </div>
            </div>
        );
    }

    const { product, variants, emiPlans } = data;
    const discount = selectedVariant
        ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
        : 0;

    return (
        <div className="min-h-screen pt-20 pb-20">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link to="/" className="hover:text-slate-300 transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-slate-300">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                    {/* ── Left: Image Gallery ── */}
                    <div className="space-y-4">
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-square border border-slate-700/50">
                            <img
                                key={activeImage}
                                src={activeImage || product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover animate-fade-in"
                            />
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {selectedVariant && selectedVariant.images.length > 1 && (
                            <div className="flex gap-3">
                                {selectedVariant.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-500' : 'border-slate-700 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Product Details ── */}
                    <div className="space-y-6">
                        {/* Brand + Name */}
                        <div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{product.brand}</span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-snug mt-1">
                                {product.name}
                            </h1>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Pricing */}
                        {selectedVariant && (
                            <div className="glass rounded-2xl p-5">
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-extrabold text-slate-100">{formatINR(selectedVariant.price)}</span>
                                    {selectedVariant.mrp > selectedVariant.price && (
                                        <>
                                            <span className="text-slate-500 line-through text-lg">{formatINR(selectedVariant.mrp)}</span>
                                            <span className="text-emerald-400 font-bold text-sm">Save {formatINR(selectedVariant.mrp - selectedVariant.price)}</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes</p>
                            </div>
                        )}

                        {/* Variant Selector */}
                        <VariantSelector
                            variants={variants}
                            selectedVariant={selectedVariant}
                            onSelect={handleVariantSelect}
                        />

                        <div className="border-t border-slate-800" />

                        {/* EMI Plans */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                    Choose EMI Plan
                                </h2>
                                <span className="text-xs text-slate-500">{emiPlans.length} plans available</span>
                            </div>
                            <div className="space-y-3">
                                {emiPlans.map((plan) => (
                                    <EmiPlanCard
                                        key={plan._id}
                                        plan={plan}
                                        isSelected={selectedPlan?._id === plan._id}
                                        onSelect={() => setSelectedPlan(plan)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Proceed Button */}
                        <div className="sticky bottom-4 pt-2">
                            {proceeded ? (
                                <div className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-center text-lg shadow-xl shadow-emerald-900/40 animate-fade-in">
                                    ✅ Plan Selected! Proceeding...
                                </div>
                            ) : (
                                <button
                                    onClick={handleProceed}
                                    disabled={!selectedPlan || !selectedVariant}
                                    id="proceed-btn"
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-200 shadow-xl shadow-blue-900/40 hover:shadow-blue-900/60 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {selectedPlan
                                        ? `Proceed with ${selectedPlan.tenure}-Month EMI @ ${formatINR(selectedPlan.monthlyAmount)}/mo`
                                        : 'Select an EMI Plan to Proceed'}
                                </button>
                            )}
                            {selectedPlan && selectedVariant && (
                                <p className="text-center text-xs text-slate-500 mt-2">
                                    Total: {formatINR(selectedPlan.monthlyAmount * selectedPlan.tenure)} ·
                                    {selectedPlan.interestRate === 0 ? ' No extra cost' : ` ${selectedPlan.interestRate}% p.a. interest`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
