import { forwardRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputCurrencyProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: number) => void;
  currency?: string;
  locale?: string;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(
  ({ className, onChange, value, currency = 'BRL', locale = 'pt-BR', ...props }, ref) => {
    const formatCurrency = (input: number): string => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(input / 100);
    };

    const parseCurrency = (input: string): number => {
      const numbers = input.replace(/\D/g, '');
      return parseInt(numbers, 10) || 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseCurrency(e.target.value);
      onChange?.(numericValue / 100);
    };

    const displayValue = typeof value === 'number' 
      ? formatCurrency(value * 100)
      : formatCurrency(0);

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="R$ 0,00"
        value={displayValue}
        onChange={handleChange}
        className={cn("input-float", className)}
        {...props}
      />
    );
  }
);

InputCurrency.displayName = 'InputCurrency';
