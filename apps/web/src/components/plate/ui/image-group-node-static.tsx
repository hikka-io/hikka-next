import { useRef } from 'react';

import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';
import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import { cn } from '@/utils/cn';

import { useImageGroupRatio } from './use-image-group-ratio';

export type ImageGroupElementStaticProps = SlateElementProps & {
    className?: string;
};

export function ImageGroupElementStatic({
    children,
    className,
    element,
    ...props
}: ImageGroupElementStaticProps) {
    const imageGroupRef = useRef<HTMLImageElement>(null);

    useImageGroupRatio(imageGroupRef, element.children);

    return (
        <PhotoProvider>
            <SlateElement
                as="div"
                {...props}
                ref={imageGroupRef}
                element={element}
                className={cn(
                    'image-group overflow-hidden rounded-md border',
                    `image-group-size-${element.children.length}`,
                    className,
                )}
            >
                <div className="image-group-container">{children}</div>
            </SlateElement>
        </PhotoProvider>
    );
}
