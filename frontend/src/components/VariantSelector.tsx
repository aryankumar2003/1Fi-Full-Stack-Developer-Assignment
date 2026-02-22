import { IVariant } from '../types';

interface Props {
    variants: IVariant[];
    selectedVariant: IVariant | null;
    onSelect: (variant: IVariant) => void;
}

const VariantSelector = ({ variants, selectedVariant, onSelect }: Props) => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Select Variant
            </h3>
            <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                    const isSelected = selectedVariant?._id === variant._id;
                    return (
                        <button
                            key={variant._id}
                            onClick={() => onSelect(variant)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${isSelected
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40'
                                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100'
                                }`}
                        >
                            {variant.storage} · {variant.color}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VariantSelector;
