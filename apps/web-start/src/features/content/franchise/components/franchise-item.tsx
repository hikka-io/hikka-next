import type { FC } from 'react';

import type {
    AnimeResponseWithWatch,
    MangaResponseWithRead,
    NovelResponseWithRead,
    ReadContentTypeEnum,
} from '@hikka/api';

import ReadlistButton from '@/components/action-buttons/readlist-button';
import WatchlistButton from '@/components/action-buttons/watchlist-button';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { useSession } from '@/features/auth/hooks/use-session';
import { MEDIA_TYPE } from '@/utils/constants/common';
import { useTitle } from '@/utils/title/use-title';

type Props = {
    content:
        | AnimeResponseWithWatch
        | MangaResponseWithRead
        | NovelResponseWithRead;
    preview?: boolean;
};

const FranchiseItem: FC<Props> = ({ content, preview }) => {
    const { user } = useSession();
    const title = useTitle(content);

    return (
        <Card>
            <HorizontalCard>
                <HorizontalCardImage
                    image={content.image}
                    href={`/${content.data_type}/${content.slug}`}
                />
                <HorizontalCardContainer>
                    <HorizontalCardTitle
                        href={`/${content.data_type}/${content.slug}`}
                    >
                        {title}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {content.year && <p>{content.year}</p>}
                        {content.year && content.media_type && (
                            <div className="size-1 rounded-full bg-muted-foreground" />
                        )}
                        {content.media_type && (
                            <p>
                                {
                                    MEDIA_TYPE[
                                        content.media_type as keyof typeof MEDIA_TYPE
                                    ].title_ua
                                }
                            </p>
                        )}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCard>
            {content.data_type === 'anime' && !preview && (
                <WatchlistButton
                    slug={content.slug}
                    anime={content as AnimeResponseWithWatch}
                    watch={
                        (content as AnimeResponseWithWatch).watch?.[0] ?? null
                    }
                    size="md"
                    disabled={!user}
                />
            )}
            {content.data_type !== 'anime' && !preview && (
                <ReadlistButton
                    content_type={content.data_type as ReadContentTypeEnum}
                    slug={content.slug}
                    content={
                        content as MangaResponseWithRead | NovelResponseWithRead
                    }
                    read={
                        (
                            content as
                                | MangaResponseWithRead
                                | NovelResponseWithRead
                        ).read?.[0] ?? null
                    }
                    size="md"
                    disabled={!user}
                />
            )}
        </Card>
    );
};

export default FranchiseItem;
