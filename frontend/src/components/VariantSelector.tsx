import { IVariant } from '../types';

interface Props {
    variants: IVariant[];
    selectedVariant: IVariant | null;
    onSelect: (variant: IVariant) => void;
}

const VariantSelector = ({ variants, selectedVariant, onSelect }: Props) => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Select Variant
            </h3>
            <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                    const isSelected = selectedVariant?._id === variant._id;
                    return (
                        <button
                            key={variant._id}
                            onClick={() => onSelect(variant)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${isSelected
                                    ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200'
                                    : 'bg-white border-gray-300 text-gray-700 hover:border-violet-400 hover:text-violet-600'
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
