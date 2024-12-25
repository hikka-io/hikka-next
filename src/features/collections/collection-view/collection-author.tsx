'use client';

import { formatDistance } from 'date-fns';
import { useParams } from 'next/navigation';

import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import useCollection from '@/services/hooks/collections/use-collection';

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
                <HorizontalCardContainer className="gap-0">
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
            </HorizontalCard>
        </Card>
    );
};

export default CollectionAuthor;
