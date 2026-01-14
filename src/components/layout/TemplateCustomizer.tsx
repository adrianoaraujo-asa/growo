import { useLayoutStore, ThemeColor, NavbarType, FooterType, ContentWidth } from '@/stores/layoutStore';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { X, Settings, Sun, Moon, Monitor, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const themeColors: { value: ThemeColor; color: string; label: string }[] = [
  { value: 'primary', color: 'hsl(238 100% 71%)', label: 'Roxo' },
  { value: 'success', color: 'hsl(100 69% 54%)', label: 'Verde' },
  { value: 'info', color: 'hsl(191 97% 47%)', label: 'Ciano' },
  { value: 'warning', color: 'hsl(40 100% 50%)', label: 'Amarelo' },
  { value: 'destructive', color: 'hsl(10 100% 56%)', label: 'Vermelho' },
  { value: 'secondary', color: 'hsl(214 14% 58%)', label: 'Cinza' },
];

export function TemplateCustomizer() {
  const {
    customizerOpen,
    setCustomizerOpen,
    themeColor,
    setThemeColor,
    navbarType,
    setNavbarType,
    footerType,
    setFooterType,
    contentWidth,
    setContentWidth,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useLayoutStore();
  
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-[60] transition-opacity",
          customizerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setCustomizerOpen(false)}
      />

      {/* Customizer Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[70] h-full w-[400px] max-w-full bg-card border-l border-border shadow-xl transition-transform duration-300",
          customizerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Template Customizer</h3>
              <p className="text-xs text-muted-foreground">Personalize e visualize em tempo real</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setCustomizerOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-6 space-y-8">
            {/* Theme Mode */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Tema
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    theme === 'light' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                  )}
                >
                  <Sun className="h-6 w-6" />
                  <span className="text-sm">Claro</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    theme === 'dark' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                  )}
                >
                  <Moon className="h-6 w-6" />
                  <span className="text-sm">Escuro</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    theme === 'system' ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                  )}
                >
                  <Monitor className="h-6 w-6" />
                  <span className="text-sm">Sistema</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Primary Color */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Cor Primária
              </Label>
              <div className="flex gap-3 flex-wrap">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setThemeColor(color.value)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                      themeColor === color.value && "ring-2 ring-offset-2 ring-offset-card"
                    )}
                    style={{ backgroundColor: color.color, boxShadow: themeColor === color.value ? `0 0 0 2px ${color.color}` : undefined }}
                    title={color.label}
                  >
                    {themeColor === color.value && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sidebar */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sidebar
              </Label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Menu Recolhido</p>
                  <p className="text-xs text-muted-foreground">Exibe apenas ícones</p>
                </div>
                <Switch
                  checked={sidebarCollapsed}
                  onCheckedChange={setSidebarCollapsed}
                />
              </div>
            </div>

            <Separator />

            {/* Navbar */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Navbar
              </Label>
              <RadioGroup
                value={navbarType}
                onValueChange={(value) => setNavbarType(value as NavbarType)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="sticky" id="navbar-sticky" />
                  <Label htmlFor="navbar-sticky" className="cursor-pointer">Fixa (Sticky)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="static" id="navbar-static" />
                  <Label htmlFor="navbar-static" className="cursor-pointer">Estática</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="hidden" id="navbar-hidden" />
                  <Label htmlFor="navbar-hidden" className="cursor-pointer">Oculta</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Footer */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Footer
              </Label>
              <RadioGroup
                value={footerType}
                onValueChange={(value) => setFooterType(value as FooterType)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="static" id="footer-static" />
                  <Label htmlFor="footer-static" className="cursor-pointer">Estático</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="sticky" id="footer-sticky" />
                  <Label htmlFor="footer-sticky" className="cursor-pointer">Fixo (Sticky)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="hidden" id="footer-hidden" />
                  <Label htmlFor="footer-hidden" className="cursor-pointer">Oculto</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Content Width */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Largura do Conteúdo
              </Label>
              <RadioGroup
                value={contentWidth}
                onValueChange={(value) => setContentWidth(value as ContentWidth)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="wide" id="content-wide" />
                  <Label htmlFor="content-wide" className="cursor-pointer">Largo (Wide)</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="boxed" id="content-boxed" />
                  <Label htmlFor="content-boxed" className="cursor-pointer">Centralizado (Boxed)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
