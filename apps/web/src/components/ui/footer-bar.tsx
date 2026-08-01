import type * as React from 'react';

import { cn } from '@/utils/cn';

/**
 * Shared action-bar layout for modal footers and the in-page edit panels, so
 * the two cannot drift apart. Modal footers add `-mx-4 -mb-4` to bleed into
 * the content padding; panels use it as-is.
 */
const footerBarClassName = 'flex flex-col gap-3 border-t p-4';

/**
 * A modal spans the viewport, so its actions collapse to a right-aligned row
 * on desktop. Panels sit in a sidebar column and stay full-width at every
 * width, so `FooterBar` keeps the base layout.
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

export { FooterBar, modalFooterBarClassName };
