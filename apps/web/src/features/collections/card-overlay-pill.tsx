import type { ComponentProps, FC } from 'react';

import { cn } from '@/utils/cn';

type Props = ComponentProps<'div'>;

/** The glass shell for icon buttons laid over a collection poster. */
const CardOverlayPill: FC<Props> = ({ className, ...props }) => (
    <div
        className={cn('surface-glass rounded-lg border p-0.5', className)}
        {...props}
    />
);

export default CardOverlayPill;
