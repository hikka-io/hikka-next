'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

export function ParagraphElement(props: PlateElementProps) {
    return (
        <PlateElement as="p" {...props} className="mb-4">
            {props.children}
        </PlateElement>
    );
}
