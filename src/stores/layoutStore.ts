import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeColor = 'primary' | 'success' | 'info' | 'warning' | 'destructive' | 'secondary';
export type LayoutType = 'vertical' | 'horizontal';
export type NavbarType = 'sticky' | 'static' | 'hidden';
export type FooterType = 'sticky' | 'static' | 'hidden';
export type ContentWidth = 'boxed' | 'wide';

interface LayoutState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  themeColor: ThemeColor;
  
  // Layout
  layoutType: LayoutType;
  contentWidth: ContentWidth;
  
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarHover: boolean;
  
  // Navbar
  navbarType: NavbarType;
  
  // Footer
  footerType: FooterType;
  
  // Customizer
  customizerOpen: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setThemeColor: (color: ThemeColor) => void;
  setLayoutType: (type: LayoutType) => void;
  setContentWidth: (width: ContentWidth) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarHover: (hover: boolean) => void;
  setNavbarType: (type: NavbarType) => void;
  setFooterType: (type: FooterType) => void;
  setCustomizerOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleCustomizer: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      // Default values
      theme: 'light',
      themeColor: 'primary',
      layoutType: 'vertical',
      contentWidth: 'wide',
      sidebarCollapsed: false,
      sidebarHover: false,
      navbarType: 'sticky',
      footerType: 'static',
      customizerOpen: false,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      setThemeColor: (themeColor) => set({ themeColor }),
      setLayoutType: (layoutType) => set({ layoutType }),
      setContentWidth: (contentWidth) => set({ contentWidth }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setSidebarHover: (sidebarHover) => set({ sidebarHover }),
      setNavbarType: (navbarType) => set({ navbarType }),
      setFooterType: (footerType) => set({ footerType }),
      setCustomizerOpen: (customizerOpen) => set({ customizerOpen }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleCustomizer: () => set((state) => ({ customizerOpen: !state.customizerOpen })),
    }),
    {
      name: 'growo-layout-settings',
    }
  )
);
