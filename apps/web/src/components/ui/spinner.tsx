import type { CSSProperties, FC } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

/**
 * Animated spinner SVG (animation lives inside the SVG) used as a mask so the
 * colour follows `currentColor` via `bg-current`. Matches the look of the
 * previous global `.loading .loading-spinner` classes.
 */
const SPINNER_MASK =
    "url(\"data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E\")";

const MASK_STYLE: CSSProperties = {
    maskImage: SPINNER_MASK,
    WebkitMaskImage: SPINNER_MASK,
    maskSize: '100%',
    WebkitMaskSize: '100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
};

const spinnerVariants = cva(
    'pointer-events-none inline-block aspect-square bg-current',
    {
        variants: {
            size: {
                sm: 'size-4',
                md: 'size-6',
                lg: 'size-8',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

type SpinnerProps = VariantProps<typeof spinnerVariants> & {
    className?: string;
};

const Spinner: FC<SpinnerProps> = ({ size, className }) => {
    return (
        <span
            role="status"
            aria-label="Завантаження"
            style={MASK_STYLE}
            className={cn(spinnerVariants({ size }), className)}
        />
    );
};

export default Spinner;
