import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { cn } from '@/utils/cn';

import {
    MAX_IMAGE_COUNT,
    type TImageGroupElement,
} from '../editor/plugins/image-group-kit';
import { ImageGroupAddImage } from './image-group-add-image';

export type ImageGroupElementProps = PlateElementProps<TImageGroupElement> & {
    className?: string;
};

export function ImageGroupElement({
    children,
    className,
    element,
    editor,
    ...props
}: ImageGroupElementProps) {
    const firstChild = element.children[0];
    const isOnlyText =
        element.children.length === 1 &&
        editor.api.isText(firstChild) &&
        firstChild.text === '';

    return (
        <PlateElement
            as="div"
            className={cn('flex items-start gap-3 overflow-x-auto', className)}
            element={element}
            editor={editor}
            {...props}
        >
            {!isOnlyText && children}
            {element.children.length < MAX_IMAGE_COUNT && (
                <ImageGroupAddImage editor={editor} element={element} />
            )}
        </PlateElement>
    );
}
