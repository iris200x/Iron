import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <select
                className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm ${className || ''}`}
                ref={ref}
                {...props}
            >
                {children}
            </select>
        );
    }
);
Select.displayName = "Select";

export { Select };