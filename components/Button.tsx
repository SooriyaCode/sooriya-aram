import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-2 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-red-800 shadow-md hover:shadow-lg",
    secondary: "bg-secondary text-black hover:bg-amber-600 shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-red-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      ) : children}
    </button>
  );
};