import type { FC } from 'react';

import {
    type CollectionContent,
    type CollectionResponse,
    ContentTypeEnum,
} from '@hikka/client';

import { buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';
import VoteButton from '@/components/action-buttons/vote-button';

type Props = {
    collection: CollectionResponse<CollectionContent>;
};

const CollectionVote: FC<Props> = ({ collection }) => {
    return (
        <Card
            className={buttonVariants({
                variant: 'secondary',
                size: 'md',
                className: 'flex-row gap-0 overflow-hidden border-none p-0',
            })}
        >
            <VoteButton
                contentType={ContentTypeEnum.COLLECTION}
                slug={collection.reference}
                myScore={collection.my_score}
                voteScore={collection.vote_score}
            />
        </Card>
    );
};

export default CollectionVote;
