import React from 'react';
import classNames from 'classnames';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-white border border-slate-200',
    outlined: 'bg-transparent border border-slate-300',
    elevated: 'bg-white shadow-lg',
  };

  return (
    <div
      className={classNames(
        'rounded-lg p-6 transition-all hover:shadow-md',
        variantClasses[variant],
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
