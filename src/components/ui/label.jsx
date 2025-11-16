import * as React from 'react';
import { cva } from 'class-variance-authority';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: '',
        error: 'text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Label = React.forwardRef(({ className, variant, ...props }, ref) => (
  <label
    ref={ref}
    className={labelVariants({ variant, className })}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label, labelVariants };