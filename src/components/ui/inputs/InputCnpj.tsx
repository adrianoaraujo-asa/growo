import { forwardRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputCnpjProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

export const InputCnpj = forwardRef<HTMLInputElement, InputCnpjProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const formatCnpj = (input: string): string => {
      const numbers = input.replace(/\D/g, '').slice(0, 14);
      
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
      if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCnpj(e.target.value);
      onChange?.(formatted);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="00.000.000/0000-00"
        value={value ? formatCnpj(String(value)) : ''}
        onChange={handleChange}
        className={cn("input-float", className)}
        {...props}
      />
    );
  }
);

InputCnpj.displayName = 'InputCnpj';
