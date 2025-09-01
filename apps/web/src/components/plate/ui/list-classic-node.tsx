'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { OL_CLASSNAME } from '@/components/typography/ol';
import { UL_CLASSNAME } from '@/components/typography/ul';

import { cn } from '@/utils/utils';

const listVariants = cva('mb-4', {
    variants: {
        variant: {
            ol: OL_CLASSNAME,
            ul: UL_CLASSNAME,
        },
    },
});

export function ListElement({
    variant,
    ...props
}: PlateElementProps & VariantProps<typeof listVariants>) {
    return (
        <PlateElement
            as={variant!}
            className={listVariants({ variant })}
            {...props}
        >
            {props.children}
        </PlateElement>
    );
}

export function BulletedListElement(props: PlateElementProps) {
    return <ListElement variant="ul" {...props} />;
}

export function NumberedListElement(props: PlateElementProps) {
    return <ListElement variant="ol" {...props} />;
}

export function ListItemElement(props: PlateElementProps) {
    return <BaseListItemElement {...props} />;
}

export function BaseListItemElement(props: PlateElementProps) {
    return (
        <PlateElement as="li" {...props} className={cn('ps-2')}>
            {props.children}
        </PlateElement>
    );
}
