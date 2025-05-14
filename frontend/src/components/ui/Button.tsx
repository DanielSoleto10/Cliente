// frontend/src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  // Base classes
  const baseClasses = 'font-medium rounded focus:outline-none transition-colors';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };
  
  // Disabled state
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className || ''}`;
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;