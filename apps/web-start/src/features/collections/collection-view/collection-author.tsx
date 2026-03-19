'use client';

import { useCollectionByReference } from '@hikka/react';
import { formatDistance } from 'date-fns';

import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import FollowButton from '@/features/common/follow-button';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { useParams } from '@/utils/navigation';

const CollectionAuthor = () => {
    const params = useParams();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const { data: collection } = useCollectionByReference({
        reference: String(params.reference),
    });

    return (
        <Card className="bg-secondary/20 backdrop-blur-xl">
            <HorizontalCard>
                <HorizontalCardImage
                    image={collection?.author.avatar}
                    imageRatio={1}
                    to={`/u/${collection?.author.username}`}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle
                        href={`/u/${collection?.author.username}`}
                    >
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
                <FollowButton
                    size={!isDesktop ? 'icon-md' : 'md'}
                    iconOnly={!isDesktop}
                    user={collection?.author}
                />
            </HorizontalCard>
        </Card>
    );
};

export default CollectionAuthor;
