import {
  Figma, Framer, Diamond, Shield, PenTool, Zap, Sparkles, Palette,
  Code, Layers, Compass, Wand2, Star, Heart, Cpu, Layout, MousePointer,
  Feather, Camera, Music, Coffee, Rocket,
} from "lucide-react";

export const iconRegistry = {
  Figma, Framer, Diamond, Shield, PenTool, Zap, Sparkles, Palette,
  Code, Layers, Compass, Wand2, Star, Heart, Cpu, Layout, MousePointer,
  Feather, Camera, Music, Coffee, Rocket,
} as const;

export type IconKey = keyof typeof iconRegistry;

export function getIcon(key?: string) {
  if (!key) return null;
  return (iconRegistry as any)[key] ?? null;
}

export const iconKeys = Object.keys(iconRegistry) as IconKey[];
