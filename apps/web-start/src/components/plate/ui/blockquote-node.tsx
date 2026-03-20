'use client';

import { PlateElement, type PlateElementProps } from 'platejs/react';

export function BlockquoteElement(props: PlateElementProps) {
    return <PlateElement as="blockquote" {...props} />;
}
