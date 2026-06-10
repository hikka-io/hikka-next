'use client';

import type { Path, TElement } from 'platejs';
import { createPlatePlugin } from 'platejs/react';

import { VideoElement } from '@/components/plate/ui/video-node';

import { extractYouTubeVideoId } from '@/utils/youtube';

export const ELEMENT_VIDEO = 'video';

export interface TVideoElement extends TElement {
    type: typeof ELEMENT_VIDEO;
    url: string;
}

export const VideoPlugin = createPlatePlugin({
    key: ELEMENT_VIDEO,
    node: {
        isElement: true,
        isVoid: true,
    },
    parsers: {
        html: {
            deserializer: {
                rules: [
                    {
                        validNodeName: 'VIDEO',
                    },
                    {
                        validNodeName: 'IFRAME',
                        validAttribute: 'src',
                    },
                ],
                parse: ({ element }) => {
                    const url =
                        element.getAttribute('src') ||
                        element.getAttribute('data-url') ||
                        '';

                    // Only YouTube embeds are supported — skip this rule for
                    // anything else so other deserializers can handle it.
                    if (!extractYouTubeVideoId(url)) return;

                    return {
                        type: ELEMENT_VIDEO,
                        url,
                        children: [{ text: '' }],
                    };
                },
            },
        },
    },
}).extendEditorTransforms(({ editor }) => ({
    insert: {
        video: (options: { url: string; at?: Path }) => {
            const { url, at } = options;

            const videoNode: TVideoElement = {
                type: ELEMENT_VIDEO,
                url,
                children: [{ text: '' }],
            };

            editor.tf.insertNodes(videoNode, { at });
        },
    },
}));

export const VideoKit = [VideoPlugin.withComponent(VideoElement)];
