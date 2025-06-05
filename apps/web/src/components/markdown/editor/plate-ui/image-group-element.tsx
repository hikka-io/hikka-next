'use client';

import { cn, withRef } from '@udecode/cn';

import ImageGroupAddImage from './image-group-add-image';
import { PlateElement } from './plate-element';

export const ImageGroupElement = withRef<typeof PlateElement>(
    ({ children, className, element, editor, ...props }, ref) => {
        const isOnlyText =
            element.children.length === 1 &&
            editor.api.isText(element.children[0]) &&
            element.children[0].text === '';

        return (
            <PlateElement
                ref={ref}
                as="div"
                className={cn('mb-4 flex gap-3 overflow-x-auto', className)}
                element={element}
                editor={editor}
                {...props}
                contentEditable={false}
            >
                {!isOnlyText && children}
                {children.length < 4 && (
                    <ImageGroupAddImage editor={editor} element={element} />
                )}
            </PlateElement>
        );
    },
);
