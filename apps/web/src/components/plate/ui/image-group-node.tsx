'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { cn } from '@/utils/utils';

import { ImageGroupAddImage } from './image-group-add-image';

export interface ImageGroupElementProps extends PlateElementProps {
    className?: string;
}

export function ImageGroupElement({
    children,
    className,
    element,
    editor,
    ...props
}: ImageGroupElementProps) {
    const isOnlyText =
        element.children.length === 1 &&
        editor.api.isText(element.children[0]) &&
        element.children[0].text === '';

    return (
        <PlateElement
            as="div"
            className={cn('mb-4 flex gap-3 overflow-x-auto', className)}
            element={element}
            editor={editor}
            {...props}
        >
            {!isOnlyText && children}
            {children.length < 4 && (
                <ImageGroupAddImage editor={editor} element={element} />
            )}
        </PlateElement>
    );
}
