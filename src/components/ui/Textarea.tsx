import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm ${className || ''}`}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };