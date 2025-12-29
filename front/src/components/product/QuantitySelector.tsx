import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const MIN_QUANTITY = 1;

export interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  onChange,
  disabled = false,
}) => (
  <div>
    <label className="block mb-3 text-sm font-medium text-gray-700">数量</label>
    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={onDecrease}
        disabled={quantity <= MIN_QUANTITY || disabled}
        className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
        aria-label="数量を減らす"
      >
        <MinusIcon className="w-5 h-5" />
      </button>
      <input
        type="number"
        min={MIN_QUANTITY}
        value={quantity}
        onChange={onChange}
        disabled={disabled}
        className="w-16 text-center text-gray-900 border-0 focus:outline-none focus:ring-0 py-2 disabled:opacity-50"
      />
      <button
        onClick={onIncrease}
        disabled={disabled}
        className="p-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="数量を増やす"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);
