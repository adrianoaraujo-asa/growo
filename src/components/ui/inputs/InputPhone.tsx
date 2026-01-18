import { forwardRef, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputPhoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const formatPhone = (input: string): string => {
      const numbers = input.replace(/\D/g, '').slice(0, 11);
      
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value);
      onChange?.(formatted);
    };

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="tel"
        placeholder="(00) 00000-0000"
        value={value ? formatPhone(String(value)) : ''}
        onChange={handleChange}
        className={cn("input-float", className)}
        {...props}
      />
    );
  }
);

InputPhone.displayName = 'InputPhone';
