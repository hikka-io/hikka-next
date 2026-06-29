import { createSlatePlugin } from 'platejs';

import { VideoElementStatic } from '@/components/plate/ui/video-node-static';

export const ELEMENT_VIDEO = 'video';

export const BaseVideoPlugin = createSlatePlugin({
    key: ELEMENT_VIDEO,
    node: {
        isElement: true,
        isVoid: true,
    },
});

export const BaseVideoKit = [BaseVideoPlugin.withComponent(VideoElementStatic)];
