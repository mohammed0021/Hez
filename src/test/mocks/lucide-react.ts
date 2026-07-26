import React from 'react';

const iconMock = (name: string) => {
  const Icon = (props: any) =>
    React.createElement('svg', {
      'data-testid': `icon-${name}`,
      ...props,
    });
  Icon.displayName = name;
  return Icon;
};

export const Dumbbell = iconMock('Dumbbell');
export const Heart = iconMock('Heart');
export const Clock = iconMock('Clock');
export const SearchX = iconMock('SearchX');
export const Trophy = iconMock('Trophy');
export const Flame = iconMock('Flame');
export const Zap = iconMock('Zap');
export const Award = iconMock('Award');
export const Target = iconMock('Target');
export const Activity = iconMock('Activity');
export const User = iconMock('User');
export const Settings = iconMock('Settings');
export const Bell = iconMock('Bell');
export const ChevronRight = iconMock('ChevronRight');
export const ChevronDown = iconMock('ChevronDown');
export const Plus = iconMock('Plus');
export const Trash2 = iconMock('Trash2');
export const Search = iconMock('Search');
export const ArrowRight = iconMock('ArrowRight');
export const LayoutDashboard = iconMock('LayoutDashboard');
export const BookOpen = iconMock('BookOpen');
export const NotebookText = iconMock('NotebookText');
export const BarChart3 = iconMock('BarChart3');
export const Apple = iconMock('Apple');
export const Pill = iconMock('Pill');
export const Calendar = iconMock('Calendar');
export const LogOut = iconMock('LogOut');
export const Home = iconMock('Home');
export const Sparkles = iconMock('Sparkles');
export const Check = iconMock('Check');
export const X = iconMock('X');
export const AlertTriangle = iconMock('AlertTriangle');
export const Info = iconMock('Info');
export const HelpCircle = iconMock('HelpCircle');
export const Shield = iconMock('Shield');
export const Download = iconMock('Download');
export const ExternalLink = iconMock('ExternalLink');
export const Moon = iconMock('Moon');
export const Sun = iconMock('Sun');
export const Monitor = iconMock('Monitor');
export const Palette = iconMock('Palette');
export const Globe = iconMock('Globe');
export const Ruler = iconMock('Ruler');
export const Weight = iconMock('Weight');
export const Camera = iconMock('Camera');
export const CalendarDays = iconMock('CalendarDays');
export const MapPin = iconMock('MapPin');
export const Cake = iconMock('Cake');
export const Phone = iconMock('Phone');
export const Pencil = iconMock('Pencil');
export const Utensils = iconMock('Utensils');
export const Droplets = iconMock('Droplets');
