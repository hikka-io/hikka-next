import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

type Props = ComponentProps<'button'> & {
    /** Show the active ring treatment. */
    active?: boolean;
};

/**
 * Square color-swatch button shared by the accent presets and the custom
 * brand picker trigger. Children (lucide icons) get the white-on-color
 * treatment automatically.
 */
const Swatch = ({ active = false, className, children, ...props }: Props) => (
    <button
        type="button"
        data-active={active}
        className={cn(
            'grid size-9 place-items-center rounded-lg border transition-transform hover:scale-105',
            'data-[active=true]:ring-2 data-[active=true]:ring-ring data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-background',
            '[&_svg]:size-4 [&_svg]:text-white [&_svg]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]',
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

export default Swatch;
