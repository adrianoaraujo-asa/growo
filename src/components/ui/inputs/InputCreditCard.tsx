import { forwardRef, ChangeEvent, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputCreditCardProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
  onBrandDetected?: (brand: string | null) => void;
}

const cardBrands = [
  { name: 'visa', pattern: /^4/, color: 'text-blue-600' },
  { name: 'mastercard', pattern: /^5[1-5]|^2[2-7]/, color: 'text-red-500' },
  { name: 'amex', pattern: /^3[47]/, color: 'text-blue-400' },
  { name: 'elo', pattern: /^4011|^4312|^4389|^5041|^5066|^5067|^509/, color: 'text-yellow-500' },
  { name: 'hipercard', pattern: /^606282|^3841/, color: 'text-red-600' },
];

export const InputCreditCard = forwardRef<HTMLInputElement, InputCreditCardProps>(
  ({ className, onChange, onBrandDetected, value, ...props }, ref) => {
    const formatCard = (input: string): string => {
      const numbers = input.replace(/\D/g, '').slice(0, 16);
      const parts = numbers.match(/.{1,4}/g) || [];
      return parts.join(' ');
    };

    const detectedBrand = useMemo(() => {
      const numbers = String(value).replace(/\D/g, '');
      if (numbers.length < 2) return null;
      
      for (const brand of cardBrands) {
        if (brand.pattern.test(numbers)) {
          return brand;
        }
      }
      return null;
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCard(e.target.value);
      onChange?.(formatted);
      
      const numbers = formatted.replace(/\D/g, '');
      if (numbers.length >= 2) {
        for (const brand of cardBrands) {
          if (brand.pattern.test(numbers)) {
            onBrandDetected?.(brand.name);
            return;
          }
        }
      }
      onBrandDetected?.(null);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          value={value ? formatCard(String(value)) : ''}
          onChange={handleChange}
          className={cn("input-float pr-10", className)}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <CreditCard className={cn(
            "h-5 w-5 transition-colors",
            detectedBrand ? detectedBrand.color : "text-muted-foreground"
          )} />
        </div>
      </div>
    );
  }
);

InputCreditCard.displayName = 'InputCreditCard';
