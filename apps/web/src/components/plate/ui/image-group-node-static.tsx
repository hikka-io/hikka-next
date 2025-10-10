import type { SlateElementProps } from 'platejs';
import { SlateElement } from 'platejs';
import { useEffect, useRef } from 'react';
import { PhotoProvider } from 'react-photo-view';

import { cn } from '@/utils/utils';

export interface ImageGroupElementStaticProps extends SlateElementProps {
    className?: string;
}

export function ImageGroupElementStatic({
    children,
    className,
    element,
    ...props
}: ImageGroupElementStaticProps) {
    const imageGroupRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const container = imageGroupRef.current;
        if (!container || element.children.length !== 1) return; // Only for single images

        const img = container?.querySelector('img');
        if (!img) return;

        const calculateRatio = () => {
            const ratio = (img.naturalHeight / img.naturalWidth) * 100;
            container.style.setProperty('--ratio', `${ratio}%`);
        };

        // If image already loaded
        if (img.complete && img.naturalHeight !== 0) {
            calculateRatio();
        } else {
            // Wait for image to load
            img.addEventListener('load', calculateRatio);
            return () => img.removeEventListener('load', calculateRatio);
        }
    }, [element.children]);

    return (
        <PhotoProvider>
            <SlateElement
                as="div"
                {...props}
                ref={imageGroupRef}
                element={element}
                className={cn(
                    'image-group mb-4 overflow-hidden rounded-md border',
                    `image-group-size-${element.children.length}`,
                    className,
                )}
            >
                <div className="image-group-container">{children}</div>
            </SlateElement>
        </PhotoProvider>
    );
}
