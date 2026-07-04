import { useEffect, useRef } from 'react';

import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';
import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import { cn } from '@/utils/cn';

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

    useEffect(() => {
        const container = imageGroupRef.current;
        if (!container || element.children.length !== 1) return;

        const img = container?.querySelector('img');
        if (!img) return;

        const calculateRatio = () => {
            const ratio = (img.naturalHeight / img.naturalWidth) * 100;
            container.style.setProperty('--ratio', `${ratio}%`);
        };

        if (img.complete && img.naturalHeight !== 0) {
            calculateRatio();
        } else {
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
