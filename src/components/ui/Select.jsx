import React from 'react';
import { cn } from '../../utils/cn';

const Select = React.forwardRef(({
  className,
  label,
  options = [],
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Select...',
  disabled = false,
  ...props
}, ref) => {
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            error ? 'text-destructive' : 'text-foreground'
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      >
        {placeholder && !options.some((o) => o.value === '') && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
