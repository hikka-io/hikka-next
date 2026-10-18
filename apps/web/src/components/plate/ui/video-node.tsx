import type { PlateElementProps } from 'platejs/react';
import { PlateElement, useSelected } from 'platejs/react';

import { cn } from '@/utils/cn';

import type { TVideoElement } from '../editor/plate-types';
import { MediaActions } from './media-actions';
import { MEDIA_NODE } from './media-node';
import { YouTubeEmbed } from './youtube-embed';

export type VideoElementProps = PlateElementProps<TVideoElement> & {
    className?: string;
};

export function VideoElement({ className, ...props }: VideoElementProps) {
    const { children, element } = props;
    const selected = useSelected();

    return (
        <PlateElement
            {...props}
            className={cn(MEDIA_NODE, 'video-embed', className)}
        >
            <div
                contentEditable={false}
                data-selected={selected}
                className="group/media relative rounded-md data-[selected=true]:ring-2 data-[selected=true]:ring-ring data-[selected=true]:ring-offset-2 data-[selected=true]:ring-offset-background"
            >
                <YouTubeEmbed url={element.url ?? ''} />
                <MediaActions element={element} />
            </div>
            {children}
        </PlateElement>
    );
}
