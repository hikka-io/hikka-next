import type { SlateElementProps } from 'platejs';
import { SlateElement } from 'platejs';
import { PhotoView } from 'react-photo-view';

import Image from '@/components/ui/image';

import { cn } from '@/utils/utils';

export interface ImageElementStaticProps extends SlateElementProps {
    className?: string;
    url?: string;
}

export function ImageElementStatic({
    className,
    element,
    ...props
}: ImageElementStaticProps) {
    const url = (element as any)?.url || '';

    return (
        <SlateElement
            as="picture"
            {...props}
            element={element}
            className="image-group-item relative"
        >
            <PhotoView src={url}>
                <Image
                    alt="image"
                    className={cn(
                        className,
                        'image-item object-cover size-auto',
                    )}
                    width={200}
                    height={100}
                    src={url}
                />
            </PhotoView>
        </SlateElement>
    );
}
