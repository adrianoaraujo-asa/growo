import { forwardRef, ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressData {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

interface InputCepProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
  onAddressFound?: (address: AddressData) => void;
}

export const InputCep = forwardRef<HTMLInputElement, InputCepProps>(
  ({ className, onChange, onAddressFound, value, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);

    const formatCep = (input: string): string => {
      const numbers = input.replace(/\D/g, '').slice(0, 8);
      
      if (numbers.length <= 5) return numbers;
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCep(e.target.value);
      onChange?.(formatted);
    };

    const searchCep = async () => {
      const cep = String(value).replace(/\D/g, '');
      if (cep.length !== 8) return;

      setIsLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          onAddressFound?.({
            logradouro: data.logradouro,
            bairro: data.bairro,
            localidade: data.localidade,
            uf: data.uf,
          });
        }
      } catch (error) {
        console.error('Error fetching CEP:', error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="flex gap-2">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder="00000-000"
          value={value ? formatCep(String(value)) : ''}
          onChange={handleChange}
          className={cn("input-float flex-1", className)}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={searchCep}
          disabled={isLoading || String(value).replace(/\D/g, '').length !== 8}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

InputCep.displayName = 'InputCep';
