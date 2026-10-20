import { type FC, type ReactElement, useState } from 'react';

import { FlashList } from '@shopify/flash-list';

type Props = {
    blocks: ReactElement[];
    onRefresh: () => Promise<unknown>;
};

// Each block mounts when the list draws it, so a block that fetches starts fetching as it nears the viewport.
const BlockList: FC<Props> = ({ blocks, onRefresh }) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="pb-8"
            data={blocks}
            keyExtractor={(block) => String(block.key)}
            renderItem={({ item }) => item}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );
};

export default BlockList;
