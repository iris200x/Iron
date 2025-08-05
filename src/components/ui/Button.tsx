import React from 'react';


const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:pointer-events-none disabled:opacity-50";

const icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};


const variantStyles = {
    default: "bg-yellow-500 text-gray-800 shadow-md hover:bg-yellow-600",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
    outline: "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 focus:ring-gray-300 focus:ring-offset-2",
    form: "w-full bg-yellow-500 text-gray-800 shadow-sm hover:bg-yellow-600 focus:ring-offset-2",
    ghost: "hover:bg-gray-100",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};

const sizeStyles = {
    default: "h-12 px-6 rounded-full",
    sm: "h-9 rounded-md px-3",
    md: "h-10 px-4 py-2 rounded-md",
    lg: "h-11 rounded-md px-8",
};

const fontSizes = {
    default: "font-medium",
    semibold: "font-semibold"
}


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variantStyles;
    size?: keyof typeof sizeStyles;
    fontSize?: keyof typeof fontSizes;
    icon?: keyof typeof icons;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', size = 'default', fontSize = 'default',icon, iconPosition = 'left', children, ...props }) => {
    
    const Icon = icon ? icons[icon] : null;
    const variantClass = variantStyles[variant];
    const sizeClass = sizeStyles[size];
    const fontSizeClass = fontSizes[fontSize]

    const combinedClasses = `${baseStyles} ${variantClass} ${fontSizeClass} ${sizeClass} ${className || ''}`;

    return (
        <button className={combinedClasses.trim()} {...props}>
            {Icon && iconPosition === 'left' && <span className="mr-2">{Icon}</span>}
            {children}
            {Icon && iconPosition === 'right' && <span className="ml-2">{Icon}</span>}
        </button>
    );
};