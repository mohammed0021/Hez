import React from 'react';

export const motion = {
  div: React.forwardRef(({ children, ...props }: any, ref: any) =>
    React.createElement('div', { ...props, ref }, children),
  ),
  span: React.forwardRef(({ children, ...props }: any, ref: any) =>
    React.createElement('span', { ...props, ref }, children),
  ),
  button: React.forwardRef(({ children, ...props }: any, ref: any) =>
    React.createElement('button', { ...props, ref }, children),
  ),
  section: React.forwardRef(({ children, ...props }: any, ref: any) =>
    React.createElement('section', { ...props, ref }, children),
  ),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export const MotionConfig = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);
