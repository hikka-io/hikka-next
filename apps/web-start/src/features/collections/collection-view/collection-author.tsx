import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';

import { getCollectionOptions } from '@hikka/api';

import FollowButton from '@/components/action-buttons/follow-button';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { useMediaQuery } from '@/services/hooks/use-media-query';
import { useParams } from '@/utils/navigation';

const CollectionAuthor = () => {
    const params = useParams();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference: String(params.reference) } }),
    );

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
