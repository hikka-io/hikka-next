import { PlateEditor } from '@udecode/plate/react';

import { VideoElement, VideoPlugin } from '../video-plugin';

export const insertVideo = (editor: PlateEditor, url: string) => {
    const text = { text: '' };

    const video: VideoElement = {
        children: [text],
        type: editor.getType(VideoPlugin),
        url: url,
    };

    editor.tf.insertNode(video);
};
