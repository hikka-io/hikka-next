'use client';

import { H3Plugin, H4Plugin, H5Plugin } from '@platejs/basic-nodes/react';

import {
    H3Element,
    H4Element,
    H5Element,
} from '@/components/plate/ui/heading-node';

export const HeadingsKit = [
    H3Plugin.configure({
        node: {
            component: H3Element,
        },
        rules: {
            break: { empty: 'reset' },
        },
        shortcuts: { toggle: { keys: 'mod+alt+3' } },
    }),
    H4Plugin.configure({
        node: {
            component: H4Element,
        },
        rules: {
            break: { empty: 'reset' },
        },
        shortcuts: { toggle: { keys: 'mod+alt+4' } },
    }),
    H5Plugin.configure({
        node: {
            component: H5Element,
        },
        rules: {
            break: { empty: 'reset' },
        },
        shortcuts: { toggle: { keys: 'mod+alt+5' } },
    }),
];
