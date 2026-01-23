import React from 'react';

interface InputRangeProps {
  label: string;
  min: number;
  max: number;
  value: number;
  unit: string;
  onChange: (value: number) => void;
}

const InputRange: React.FC<InputRangeProps> = ({ label, min, max, value, unit, onChange }) => {
  const displayValue = unit.includes('m/s') ? value.toFixed(1) : value.toFixed(0);

  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="value-display">{displayValue} {unit}</div>
    </div>
  );
};

export default InputRange;
