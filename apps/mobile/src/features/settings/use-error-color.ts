import { useCSSVariable } from 'uniwind';

/** The token color for a form error inside a native section footer, which takes a color value, not a class. */
export const useErrorColor = () => {
    const color = useCSSVariable('--color-destructive-foreground');

    return typeof color === 'string' ? color : undefined;
};
