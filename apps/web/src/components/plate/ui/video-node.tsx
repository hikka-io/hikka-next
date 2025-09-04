'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import { Button } from '@/components/ui/button';

import {
    extractYouTubeVideoId,
    getYouTubeThumbnail,
} from '@/utils/parse-youtube-thumb';
import { cn } from '@/utils/utils';

export interface VideoElementProps extends PlateElementProps {
    className?: string;
    url?: string;
}

interface VideoInfo {
    embedUrl: string;
    thumbnailUrl: string | null;
}

function getVideoInfo(url: string): VideoInfo {
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = extractYouTubeVideoId(url);
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: getYouTubeThumbnail(videoId),
        };
    }
    if (url.includes('youtu.be/')) {
        const videoId = extractYouTubeVideoId(url);
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: getYouTubeThumbnail(videoId),
        };
    }

    // Return the original URL if it's already an embed URL or direct video file
    return {
        embedUrl: url,
        thumbnailUrl: null,
    };
}

export function VideoElement({ className, ...props }: VideoElementProps) {
    const { children, element, editor } = props;
    const url = (element as any)?.url || props.url || '';

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
                'relative mb-4 h-28 w-44 cursor-pointer rounded-md bg-cover bg-center',
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
