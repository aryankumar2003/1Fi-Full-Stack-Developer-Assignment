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
            className={`w-full text-left rounded-xl border p-4 transition-all duration-200 relative ${isSelected
                    ? 'border-violet-500 bg-violet-50 shadow-md shadow-violet-100'
                    : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/30'
                }`}
        >
            {plan.isPopular && (
                <div className="absolute -top-2.5 left-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white shadow">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="flex items-start justify-between gap-3">
                {/* Left: Monthly + Tenure */}
                <div className="flex items-center gap-3">
                    {/* Radio */}
                    <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'border-violet-600' : 'border-gray-300'
                            }`}
                    >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-gray-900">{formatINR(plan.monthlyAmount)}</span>
                            <span className="text-sm text-gray-400">/mo</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">{plan.tenure} months tenure</div>
                    </div>
                </div>

                {/* Right: Interest + Cashback */}
                <div className="text-right flex-shrink-0">
                    {plan.interestRate === 0 ? (
                        <span className="inline-block text-xs font-bold px-2 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200">
                            0% Interest
                        </span>
                    ) : (
                        <span className="inline-block text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
                            {plan.interestRate}% p.a.
                        </span>
                    )}
                    {plan.cashback > 0 && (
                        <div className="mt-1.5 text-xs text-orange-500 font-medium">
                            🎁 {plan.cashbackDescription}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};

export default EmiPlanCard;
