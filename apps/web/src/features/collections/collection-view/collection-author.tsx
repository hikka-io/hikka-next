'use client';

import { useCollection } from '@hikka/react';
import { formatDistance } from 'date-fns';
import { useParams } from 'next/navigation';

import FollowButton from '@/components/follow-button';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

const CollectionAuthor = () => {
    const params = useParams();

    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    return (
        <Card>
            <HorizontalCard href={`/u/${collection?.author.username}`}>
                <HorizontalCardImage
                    image={collection?.author.avatar}
                    imageRatio={1}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle>
                        {collection?.author.username}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {formatDistance(
                            collection!.updated * 1000,
                            Date.now(),
                            {
                                addSuffix: true,
                            },
                        )}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
                <FollowButton size="md" user={collection?.author} />
            </HorizontalCard>
        </Card>
    );
};

export default CollectionAuthor;
