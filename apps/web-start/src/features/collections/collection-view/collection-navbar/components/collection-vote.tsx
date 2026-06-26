import type { ComponentProps, FC } from 'react';

import { type CollectionResponse, ContentTypeEnum } from '@hikka/api';

import VoteButton from '@/components/action-buttons/vote-button';
import { buttonVariants } from '@/components/ui/button';
import Card from '@/components/ui/card';

type Props = {
    collection: CollectionResponse;
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
            {/* TODO(phase2): drop cast once VoteButton is migrated to @hikka/api types */}
            <VoteButton
                contentType={
                    ContentTypeEnum.COLLECTION as ComponentProps<
                        typeof VoteButton
                    >['contentType']
                }
                slug={collection.reference}
                myScore={collection.my_score}
                voteScore={collection.vote_score}
            />
        </Card>
    );
};

export default CollectionVote;
