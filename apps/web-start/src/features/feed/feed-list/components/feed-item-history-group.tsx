import { MoreHorizontal } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { FeedHistoryGroup } from '../../types';
import FeedItem from './feed-item';

interface Props {
    group: FeedHistoryGroup;
    expanded: boolean;
    onExpand: () => void;
}

const FeedItemHistoryGroup: FC<Props> = ({ group, expanded, onExpand }) => {
    return (
        <>
            <FeedItem item={group.firstItem} />
            {expanded ? (
                group.hiddenItems.map((item) => (
                    <FeedItem key={item.reference} item={item} />
                ))
            ) : (
                <Button
                    onClick={onExpand}
                    variant="ghost"
                    className="rounded-none border-b text-muted-foreground"
                >
                    <MoreHorizontal />
                    Ще {group.hiddenItems.length} активностей
                </Button>
            )}
        </>
    );
};

export default FeedItemHistoryGroup;
