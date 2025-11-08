'use client';

import { useEffect } from 'react';

type Colors = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
};

export function ThemeInjector({ colors }: { colors: Colors | undefined }) {
  useEffect(() => {
    if (!colors) return;
    
    const root = document.documentElement;
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);

    // This is a simple way to derive foreground colors.
    // For a real app, you might want more sophisticated logic or more CSS variables.
    const primaryLightness = parseInt(colors.primary.split(' ')[2], 10);
    const primaryFg = primaryLightness > 50 ? '0 0% 0%' : '0 0% 100%';
    root.style.setProperty('--primary-foreground', primaryFg);
    
    const accentLightness = parseInt(colors.accent.split(' ')[2], 10);
    const accentFg = accentLightness > 50 ? '0 0% 0%' : '0 0% 100%';
    root.style.setProperty('--accent-foreground', accentFg);

  }, [colors]);

  return null; // This component doesn't render anything
}
