import { createPlatePlugin } from 'platejs/react';

import { BlockInsertButton } from '@/components/plate/ui/block-insert-button';

import { BLOCK_INSERT_KEY } from './trigger-keys';

export const BlockInsertKit = [
    createPlatePlugin({
        key: BLOCK_INSERT_KEY,
        render: { belowRootNodes: BlockInsertButton },
    }),
];
