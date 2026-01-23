import React from 'react';

interface InfoRowProps {
  label: string;
  value: number;
  unit: string;
  className?: string;
  id?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, unit, className = '', id }) => {
  return (
    <div className="info-row">
      <span className="info-label">{label}:</span>
      <span className={`info-value ${className}`} id={id}>{value.toFixed(2)} {unit}</span>
    </div>
  );
};

export default InfoRow;
