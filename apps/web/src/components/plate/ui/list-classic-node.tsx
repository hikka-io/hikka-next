'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

const listVariants = cva('mb-4', {
    variants: {
        variant: {
            ul: 'ml-6 list-disc [&>li]:mt-2',
            ol: 'ml-6 list-decimal [&>li]:mt-2',
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
        <PlateElement as="li" {...props} className="ps-2">
            {props.children}
        </PlateElement>
    );
}
