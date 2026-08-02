import type * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * Shared action-bar layout for modal footers and the in-page edit panels, so
 * the two cannot drift apart. Modal footers add `-mx-4 -mb-4` to bleed into
 * the content padding; panels use it as-is.
 */
const footerBarClassName = 'flex flex-col gap-3 border-t p-4';

/**
 * Only for footers that span a wide surface — a dialog or a drawer. A side
 * sheet and an in-page panel are both narrow columns, so their actions stay
 * full-width and never collapse to a right-aligned row.
 */
const modalFooterBarClassName = cn(
    footerBarClassName,
    'md:flex-row md:justify-end',
);

function FooterBar({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="footer-bar"
            className={cn(footerBarClassName, className)}
            {...props}
        />
    );
}

export { FooterBar, footerBarClassName, modalFooterBarClassName };
