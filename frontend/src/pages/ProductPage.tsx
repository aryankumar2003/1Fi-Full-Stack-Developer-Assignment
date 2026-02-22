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
                    <div className="aspect-square bg-gray-100 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-100 rounded w-3/4" />
                        <div className="h-5 bg-gray-100 rounded w-1/2" />
                        <div className="h-12 bg-gray-100 rounded w-1/3 mt-6" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-red-500 text-lg font-semibold">{error || 'Product not found'}</p>
                    <Link to="/" className="mt-4 inline-block text-violet-600 hover:text-violet-700 underline text-sm">
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

    // Compute EMI monthly amounts using the standard reducing-balance formula,
    // applied to the currently selected variant's price.
    const calcMonthly = (price: number, interestRate: number, tenure: number): number => {
        if (interestRate === 0) return Math.round(price / tenure);
        const r = interestRate / 1200;
        return Math.round((price * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1));
    };

    const adjustedEmiPlans = emiPlans.map((plan) => ({
        ...plan,
        monthlyAmount: selectedVariant
            ? calcMonthly(selectedVariant.price, plan.interestRate, plan.tenure)
            : plan.monthlyAmount,
    }));

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link to="/" className="hover:text-violet-600 transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                    {/* ── Left: Image Gallery ── */}
                    <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 aspect-square shadow-sm">
                            <img
                                key={activeImage}
                                src={activeImage || product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow">
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
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white ${activeImage === img
                                            ? 'border-violet-500'
                                            : 'border-gray-200 opacity-70 hover:opacity-100'
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
                            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">{product.brand}</span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mt-1">
                                {product.name}
                            </h1>
                            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Pricing */}
                        {selectedVariant && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-extrabold text-gray-900">{formatINR(selectedVariant.price)}</span>
                                    {selectedVariant.mrp > selectedVariant.price && (
                                        <>
                                            <span className="text-gray-400 line-through text-lg">{formatINR(selectedVariant.mrp)}</span>
                                            <span className="text-green-600 font-bold text-sm">Save {formatINR(selectedVariant.mrp - selectedVariant.price)}</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                            </div>
                        )}

                        {/* Variant Selector */}
                        <VariantSelector
                            variants={variants}
                            selectedVariant={selectedVariant}
                            onSelect={handleVariantSelect}
                        />

                        <div className="border-t border-gray-200" />

                        {/* EMI Plans */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Choose EMI Plan
                                </h2>
                                <span className="text-xs text-gray-400">{adjustedEmiPlans.length} plans available</span>
                            </div>
                            <div className="space-y-3">
                                {adjustedEmiPlans.map((plan) => (
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
                                <div className="w-full py-4 rounded-xl bg-green-500 text-white font-bold text-center text-lg shadow-lg">
                                    ✅ Plan Selected! Proceeding...
                                </div>
                            ) : (
                                <button
                                    onClick={handleProceed}
                                    disabled={!selectedPlan || !selectedVariant}
                                    id="proceed-btn"
                                    className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {selectedPlan
                                        ? `Proceed with ${selectedPlan.tenure}-Month EMI @ ${formatINR(adjustedEmiPlans.find(p => p._id === selectedPlan._id)?.monthlyAmount ?? selectedPlan.monthlyAmount)}/mo`
                                        : 'Select an EMI Plan to Proceed'}
                                </button>
                            )}
                            {selectedPlan && selectedVariant && (
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    {(() => { const adj = adjustedEmiPlans.find(p => p._id === selectedPlan._id); const amt = adj?.monthlyAmount ?? selectedPlan.monthlyAmount; return <>Total: {formatINR(amt * selectedPlan.tenure)} · {selectedPlan.interestRate === 0 ? ' No extra cost' : ` ${selectedPlan.interestRate}% p.a. interest`}</>; })()}
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
