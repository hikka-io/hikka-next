'use client';

import { cn, withRef } from '@udecode/cn';
import { useElement } from '@udecode/plate/react';
import { PhotoView } from 'react-photo-view';

import Image from '../../../ui/image';
import { ImageItemElement } from '../plugins/image-group-plugin/image-group-plugin';

export const ImageViewElement = withRef<typeof Image>(
    ({ children, className }, ref) => {
        const element = useElement<ImageItemElement>();

        return (
            <PhotoView src={element.url}>
                <picture className="relative size-full">
                    <Image
                        alt="image"
                        className={cn(className, 'object-cover image-item')}
                        width={200}
                        height={100}
                        src={element.url}
                        ref={ref}
                    />
                </picture>
            </PhotoView>
        );
    },
);
