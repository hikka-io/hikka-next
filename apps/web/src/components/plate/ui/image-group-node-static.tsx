import type { SlateElementProps } from 'platejs';
import { SlateElement } from 'platejs';
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
    return (
        <PhotoProvider>
            <SlateElement
                as="div"
                {...props}
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
