export type ThemeId =
  | 'hez-green'
  | 'blossom-pink'
  | 'ocean-blue'
  | 'purple'
  | 'orange'
  | 'crimson'
  | 'midnight'
  | 'snow';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  id: ThemeId;
  label: string;
  emoji: string;
  description: string;
}

export const themes: Theme[] = [
  { id: 'hez-green', label: 'Hêz Green', emoji: '🟢', description: 'Default emerald theme' },
  { id: 'blossom-pink', label: 'Blossom Pink', emoji: '🌸', description: 'Soft pink blossom' },
  { id: 'ocean-blue', label: 'Ocean Blue', emoji: '🔵', description: 'Deep ocean blue' },
  { id: 'purple', label: 'Purple', emoji: '🟣', description: 'Royal purple' },
  { id: 'orange', label: 'Orange', emoji: '🟠', description: 'Warm orange' },
  { id: 'crimson', label: 'Crimson', emoji: '🔴', description: 'Bold crimson red' },
  { id: 'midnight', label: 'Midnight', emoji: '⚫', description: 'Dark midnight' },
  { id: 'snow', label: 'Snow', emoji: '⚪', description: 'Pure snow white' },
];
