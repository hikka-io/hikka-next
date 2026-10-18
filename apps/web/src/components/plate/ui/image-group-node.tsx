import { useRef } from 'react';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement, useSelected } from 'platejs/react';

import { cn } from '@/utils/cn';

import {
    MAX_IMAGE_COUNT,
    type TImageGroupElement,
} from '../editor/plate-types';
import { ImageGroupAddImage } from './image-group-add-image';
import { ImageGroupContext } from './image-group-context';
import { MEDIA_NODE } from './media-node';
import { useImageGroupRatio } from './use-image-group-ratio';

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
    const ref = useRef<HTMLDivElement>(null);
    const selected = useSelected();
    const count = element.children.length;
    const firstChild = element.children[0];
    const isOnlyText =
        count === 1 && editor.api.isText(firstChild) && firstChild.text === '';

    useImageGroupRatio(ref, element.children);

    if (isOnlyText) {
        return (
            <PlateElement
                as="div"
                className={cn('flex', className)}
                element={element}
                editor={editor}
                {...props}
            >
                <ImageGroupAddImage editor={editor} element={element} />
            </PlateElement>
        );
    }

    return (
        <PlateElement
            as="div"
            ref={ref}
            className={cn(
                MEDIA_NODE,
                'image-group overflow-hidden rounded-md border',
                `image-group-size-${count}`,
                // An outer ring: one inside the image would be clipped by the rounded corners.
                selected &&
                    'ring-2 ring-ring ring-offset-2 ring-offset-background',
                className,
            )}
            element={element}
            editor={editor}
            {...props}
        >
            <ImageGroupContext value={element}>
                <div className="image-group-container">{children}</div>
            </ImageGroupContext>
            {count < MAX_IMAGE_COUNT && (
                <ImageGroupAddImage
                    editor={editor}
                    element={element}
                    className="absolute bottom-2 left-2 z-30"
                />
            )}
        </PlateElement>
    );
}
