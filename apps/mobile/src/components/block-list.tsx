import type { FC, ReactElement } from 'react';

import { FlashList } from '@shopify/flash-list';

type Props = {
    blocks: ReactElement[];
    refreshing: boolean;
    onRefresh: () => void;
};

// Each block mounts when the list draws it, so a block that fetches starts fetching as it nears the viewport.
// Blocks are unrelated components, so each is its own item type and a cell never recycles into another block.
const BlockList: FC<Props> = ({ blocks, refreshing, onRefresh }) => (
    <FlashList
        className="bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="pb-8"
        data={blocks}
        keyExtractor={(block) => String(block.key)}
        getItemType={(block) => String(block.key)}
        renderItem={({ item }) => item}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />
);

export default BlockList;
