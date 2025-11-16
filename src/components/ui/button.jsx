import React from 'react';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const buttonSizes = {
  sm: 'h-9 px-3 text-xs rounded-md',
  default: 'h-10 px-4 py-2 rounded-md',
  lg: 'h-11 px-8 rounded-md',
  icon: 'h-10 w-10',
};

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'default',
      className = '',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          buttonVariants[variant] || buttonVariants.primary
        } ${buttonSizes[size] || buttonSizes.default} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {LeftIcon && <LeftIcon className="h-4 w-4" />}
            {children}
            {RightIcon && <RightIcon className="h-4 w-4" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants, buttonSizes };