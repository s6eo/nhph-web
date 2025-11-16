import * as React from 'react';
import { cva } from 'class-variance-authority';

const formErrorVariants = cva('text-sm font-medium text-destructive', {
  variants: {
    size: {
      default: 'text-sm',
      sm: 'text-xs',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const FormError = React.forwardRef(({ className, children, size, ...props }, ref) => {
  if (!children) return null;
  
  return (
    <p
      ref={ref}
      className={formErrorVariants({ size, className })}
      {...props}
    >
      {children}
    </p>
  );
});

FormError.displayName = 'FormError';

export { FormError, formErrorVariants };
