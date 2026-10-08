import { createSlatePlugin } from 'platejs';

import { VideoElementStatic } from '@/components/plate/ui/video-node-static';

import { ELEMENT_VIDEO } from '../plate-types';

export const BaseVideoPlugin = createSlatePlugin({
    key: ELEMENT_VIDEO,
    node: {
        isElement: true,
        isVoid: true,
    },
});

export const BaseVideoKit = [BaseVideoPlugin.withComponent(VideoElementStatic)];
