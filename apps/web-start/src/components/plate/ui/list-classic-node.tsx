'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

export function ListElement({
    variant,
    ...props
}: PlateElementProps & { variant?: 'ul' | 'ol' }) {
    return (
        <PlateElement as={variant!} {...props}>
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
        <PlateElement as="li" {...props}>
            {props.children}
        </PlateElement>
    );
}
