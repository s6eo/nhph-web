import * as React from 'react';
import { Label } from './label';
import { FormError } from './form-error';

const FormField = React.forwardRef(
  (
    {
      className,
      label,
      error,
      description,
      required,
      children,
      labelClassName,
      errorClassName,
      descriptionClassName,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    
    return (
      <div className={className} ref={ref} {...props}>
        {label && (
          <Label htmlFor={id} className={labelClassName}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {description && (
          <p className={`text-sm text-muted-foreground mb-2 ${descriptionClassName}`}>
            {description}
          </p>
        )}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id: child.props.id || id,
              'aria-invalid': error ? 'true' : 'false',
              'aria-required': required,
              'aria-describedby': error ? `${id}-error` : undefined,
              variant: error ? 'error' : child.props.variant,
            });
          }
          return child;
        })}
        {error && (
          <FormError id={`${id}-error`} className={errorClassName}>
            {error}
          </FormError>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
