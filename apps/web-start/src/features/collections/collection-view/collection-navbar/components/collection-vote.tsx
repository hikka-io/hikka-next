'use client';

import {
    CollectionContent,
    CollectionResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { FC } from 'react';

import { buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';

import VoteButton from '@/features/common/vote-button';

interface Props {
    collection: CollectionResponse<CollectionContent>;
}

const CollectionVote: FC<Props> = ({ collection }) => {
    return (
        <Card
            className={buttonVariants({
                variant: 'secondary',
                size: 'md',
                className: 'flex-row p-0 overflow-hidden border-none gap-0',
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
