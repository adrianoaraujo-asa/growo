import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import { Heart } from 'lucide-react';

export function AppFooter() {
  const { footerType } = useLayoutStore();

  if (footerType === 'hidden') return null;

  return (
    <footer
      className={cn(
        "h-14 border-t border-border bg-card px-6 flex items-center justify-between text-sm text-muted-foreground",
        footerType === 'sticky' && "sticky bottom-0"
      )}
    >
      <div className="flex items-center gap-1">
        <span>© {new Date().getFullYear()} Growo. Feito com</span>
        <Heart className="h-4 w-4 text-destructive fill-destructive" />
        <span>por</span>
        <a
          href="https://growo.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Growo Team
        </a>
      </div>
      
      <div className="hidden sm:flex items-center gap-4">
        <a href="#" className="hover:text-foreground transition-colors">
          Licença
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Mais Temas
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Documentação
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Suporte
        </a>
      </div>
    </footer>
  );
}
