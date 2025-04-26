'use client';

import { cn } from '@udecode/cn';
import { useElement } from '@udecode/plate/react';
import { forwardRef } from 'react';
import { PhotoView } from 'react-photo-view';

import Image from '../../../ui/image';
import { ImageItemElement } from '../plugins/image-group-plugin/image-group-plugin';

type ImageViewElementProps = {
    className?: string;
    children?: React.ReactNode;
};

export const ImageViewElement = forwardRef<
    HTMLImageElement,
    ImageViewElementProps
>(({ className }, ref) => {
    const element = useElement<ImageItemElement>();

    return (
        <PhotoView src={element.url}>
            <picture className="relative size-full">
                <Image
                    alt="image"
                    className={cn(className, 'image-item object-cover')}
                    width={200}
                    height={100}
                    src={element.url}
                    ref={ref}
                />
            </picture>
        </PhotoView>
    );
});
