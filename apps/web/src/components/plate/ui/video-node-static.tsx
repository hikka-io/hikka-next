import type { SlateElementProps } from 'platejs/static';
import { SlateElement } from 'platejs/static';

import { cn } from '@/utils/cn';

import type { TVideoElement } from '../editor/plate-types';
import { YouTubeEmbed } from './youtube-embed';

export type VideoElementStaticProps = SlateElementProps<TVideoElement> & {
    className?: string;
};

export function VideoElementStatic({
    className,
    element,
    ...props
}: VideoElementStaticProps) {
    return (
        <SlateElement
            as="div"
            {...props}
            element={element}
            className={cn('video-embed', className)}
        >
            <YouTubeEmbed url={element.url ?? ''} />
        </SlateElement>
    );
}
