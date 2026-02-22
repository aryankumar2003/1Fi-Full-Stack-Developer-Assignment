import { IEmiPlan } from '../types';

interface Props {
    plan: IEmiPlan;
    isSelected: boolean;
    onSelect: () => void;
}

const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const EmiPlanCard = ({ plan, isSelected, onSelect }: Props) => {
    return (
        <button
            onClick={onSelect}
            id={`emi-plan-${plan._id}`}
            className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 relative ${isSelected
                    ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-900/30'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60'
                }`}
        >
            {plan.isPopular && (
                <div className="absolute -top-2.5 left-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="flex items-start justify-between gap-3">
                {/* Left: Monthly + Tenure */}
                <div className="flex items-center gap-3">
                    {/* Radio */}
                    <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-500' : 'border-slate-600'
                            }`}
                    >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-slate-100">{formatINR(plan.monthlyAmount)}</span>
                            <span className="text-sm text-slate-400">/mo</span>
                        </div>
                        <div className="text-sm text-slate-400 mt-0.5">{plan.tenure} months tenure</div>
                    </div>
                </div>

                {/* Right: Interest + Cashback */}
                <div className="text-right flex-shrink-0">
                    {plan.interestRate === 0 ? (
                        <span className="inline-block text-xs font-bold px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            0% Interest
                        </span>
                    ) : (
                        <span className="inline-block text-xs font-semibold px-2 py-1 rounded-lg bg-slate-900/60 text-slate-400 border border-slate-700">
                            {plan.interestRate}% p.a.
                        </span>
                    )}
                    {plan.cashback > 0 && (
                        <div className="mt-1.5 text-xs text-amber-400 font-medium">
                            🎁 {plan.cashbackDescription}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};

export default EmiPlanCard;
