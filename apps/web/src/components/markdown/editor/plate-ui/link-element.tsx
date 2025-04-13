'use client';

import { cn, withRef } from '@udecode/cn';
import type { TLinkElement } from '@udecode/plate-link';
import { useLink } from '@udecode/plate-link/react';
import { useElement } from '@udecode/plate/react';

import { PlateElement } from './plate-element';

export const LinkElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        const element = useElement<TLinkElement>();
        const { props: linkProps } = useLink({ element });

        return (
            <PlateElement
                ref={ref}
                as="span"
                className={cn(
                    'font-medium text-primary underline decoration-primary underline-offset-4',
                    className,
                )}
                {...(linkProps as any)}
                {...props}
            >
                {children}
            </PlateElement>
        );
    },
);
