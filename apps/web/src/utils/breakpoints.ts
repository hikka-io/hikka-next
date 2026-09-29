export const BREAKPOINT = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINT;

export const minWidth = (breakpoint: Breakpoint) =>
    `(min-width: ${BREAKPOINT[breakpoint]}px)`;

export const maxWidth = (breakpoint: Breakpoint) =>
    `(max-width: ${BREAKPOINT[breakpoint] - 1}px)`;
