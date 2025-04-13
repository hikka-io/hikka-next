'use client';

import { cn, withRef } from '@udecode/cn';
import { useElement } from '@udecode/plate/react';
import { useCallback } from 'react';

import parseYouTubeThumbnail from '../../../../utils/parse-youtube-thumb';
import MaterialSymbolsDeleteForever from '../../../icons/material-symbols/MaterialSymbolsDeleteForever';
import { Button } from '../../../ui/button';
import { VideoElement as VideoElementType } from '../plugins/video-plugin/video-plugin';
import { PlateElement } from './plate-element';

export const VideoElement = withRef<typeof PlateElement>(
    ({ className, editor, ...props }, ref) => {
        const element = useElement<VideoElementType>();

        const handleDeleteMediaItem = () => {
            editor.tf.removeNodes({
                at: editor.api.findPath(element),
            });
        };

        const parseThumbnail = useCallback(() => {
            if (
                element.url.includes('youtube.com') ||
                element.url.includes('youtu.be')
            ) {
                return parseYouTubeThumbnail(element.url);
            }

            return element.url;
        }, [element.url]);

        return (
            <PlateElement
                editor={editor}
                {...props}
                className={cn(
                    className,
                    'relative h-28 w-44 cursor-pointer rounded-md bg-cover bg-center mb-4',
                )}
                style={{
                    backgroundImage: `url(${parseThumbnail()})`,
                }}
                ref={ref}
                contentEditable={false}
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
            </PlateElement>
        );
    },
);
