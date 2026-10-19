import { KEYS, PathApi } from 'platejs';
import { createPlatePlugin } from 'platejs/react';

import { normalizeYouTubeVideoUrl } from '@hikka/core';

import { VideoElement } from '@/components/plate/ui/video-node';

import { ELEMENT_VIDEO } from '../plate-types';
import { insertBlockAtSelection } from '../transforms';

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
                    const url = normalizeYouTubeVideoUrl(
                        element.getAttribute('src') ||
                            element.getAttribute('data-url') ||
                            '',
                    );

                    // Only YouTube embeds are supported — skip this rule for
                    // anything else so other deserializers can handle it.
                    if (!url) return;

                    return {
                        type: ELEMENT_VIDEO,
                        url,
                        children: [{ text: '' }],
                    };
                },
            },
        },
    },
})
    .overrideEditor(({ editor, tf: { insertData } }) => ({
        transforms: {
            insertData(data: DataTransfer) {
                const text = data.getData('text/plain').trim();
                const url = /\s/.test(text)
                    ? null
                    : normalizeYouTubeVideoUrl(text);
                const block = editor.api.block();
                const emptyLine =
                    !!block &&
                    block[1].length === 1 &&
                    block[0].type === KEYS.p &&
                    editor.api.isEmpty(block[0]);

                if (url && emptyLine) {
                    editor.getTransforms(VideoPlugin).insert.video({ url });
                    return;
                }

                insertData(data);
            },
        },
    }))
    .extendEditorTransforms(({ editor }) => ({
        insert: {
            video: ({ url }: { url: string }) => {
                const at = insertBlockAtSelection(
                    editor,
                    { type: ELEMENT_VIDEO, url, children: [{ text: '' }] },
                    { highest: true },
                );

                // A void cannot hold the caret for typing; move it to the next line.
                const next = PathApi.next(at);
                if (!editor.api.node(next)) {
                    editor.tf.insertNodes(editor.api.create.block(), {
                        at: next,
                    });
                }
                editor.tf.select(editor.api.start(next));
            },
        },
    }));

export const VideoKit = [VideoPlugin.withComponent(VideoElement)];
