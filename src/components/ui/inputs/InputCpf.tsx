import { forwardRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputCpfProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

export const InputCpf = forwardRef<HTMLInputElement, InputCpfProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const formatCpf = (input: string): string => {
      const numbers = input.replace(/\D/g, '').slice(0, 11);
      
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCpf(e.target.value);
      onChange?.(formatted);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="000.000.000-00"
        value={value ? formatCpf(String(value)) : ''}
        onChange={handleChange}
        className={cn("input-float", className)}
        {...props}
      />
    );
  }
);

InputCpf.displayName = 'InputCpf';
