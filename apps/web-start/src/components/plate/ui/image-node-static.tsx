import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';
import { PhotoView } from 'react-photo-view';

import Image from '@/components/ui/image';
import { cn } from '@/utils/cn';

import type { TImageElement } from '../editor/plugins/image-kit';

export type ImageElementStaticProps = SlateElementProps<TImageElement> & {
    className?: string;
};

export function ImageElementStatic({
    className,
    element,
    ...props
}: ImageElementStaticProps) {
    const url = element.url ?? '';

    return (
        <SlateElement
            as="picture"
            {...props}
            element={element}
            className="image-group-item relative"
        >
            <PhotoView src={url}>
                <Image
                    unoptimized
                    alt="image"
                    className={cn(className, 'image-item object-cover')}
                    src={url}
                />
            </PhotoView>
        </SlateElement>
    );
}
