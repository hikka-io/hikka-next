import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { extractYouTubeVideoId, getYouTubeThumbnail } from '@/utils/youtube';

import type { TVideoElement } from '../editor/plugins/video-kit';

export type VideoElementProps = PlateElementProps<TVideoElement> & {
    className?: string;
};

interface VideoInfo {
    embedUrl: string;
    thumbnailUrl: string | null;
}

function getVideoInfo(url: string): VideoInfo {
    const videoId = extractYouTubeVideoId(url);

    if (videoId) {
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: getYouTubeThumbnail(videoId),
        };
    }

    // Already an embed URL or direct video file
    return {
        embedUrl: url,
        thumbnailUrl: null,
    };
}

export function VideoElement({ className, ...props }: VideoElementProps) {
    const { children, element, editor } = props;
    const url = element.url ?? '';

    const handleDeleteMediaItem = () => {
        editor.tf.removeNodes({
            at: editor.api.findPath(element),
        });
    };

    const videoInfo = getVideoInfo(url);

    return (
        <PlateElement
            {...props}
            className={cn(
                className,
                'video-embed relative h-28 w-44 cursor-pointer rounded-md bg-center bg-cover',
            )}
            style={{
                backgroundImage: `url(${videoInfo.thumbnailUrl})`,
            }}
        >
            <div className="absolute bottom-0 left-0 flex w-full justify-end p-2">
                <Button
                    variant="secondary"
                    size="icon-sm"
                    onClick={handleDeleteMediaItem}
                >
                    <MaterialSymbolsDeleteForever />
                </Button>
            </div>
            {children}
        </PlateElement>
    );
}
