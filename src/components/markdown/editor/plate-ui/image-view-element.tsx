'use client';

import { cn, withRef } from '@udecode/cn';
import { useElement } from '@udecode/plate-common/react';
import { PhotoView } from 'react-photo-view';

import { ImageItemElement } from '../plugins/image-group-plugin/image-group-plugin';
import { PlateElement } from './plate-element';

export const ImageViewElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        const element = useElement<ImageItemElement>();

        return (
            <PhotoView src={element.url}>
                <PlateElement
                    {...props}
                    className={cn(
                        className,
                        'size-full cursor-pointer bg-cover bg-center',
                    )}
                    style={{
                        backgroundImage: `url(${element.url})`,
                    }}
                    ref={ref}
                    contentEditable={false}
                >
                    {children}
                </PlateElement>
            </PhotoView>
        );
    },
);
