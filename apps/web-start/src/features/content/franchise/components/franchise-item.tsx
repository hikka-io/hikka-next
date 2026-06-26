import type { ComponentProps, FC } from 'react';

import type {
    AnimeResponseWithWatch,
    MangaResponseWithRead,
    NovelResponseWithRead,
} from '@hikka/api';
import { useSession } from '@/features/auth/hooks/use-session';
import { useTitle } from '@/utils/title/use-title';

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
import { MEDIA_TYPE } from '@/utils/constants/common';

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
                    // TODO(phase2): drop cast
                    anime={
                        content as unknown as ComponentProps<
                            typeof WatchlistButton
                        >['anime']
                    }
                    // TODO(phase2): drop cast
                    watch={
                        ((content as AnimeResponseWithWatch).watch?.[0] ??
                            null) as ComponentProps<
                            typeof WatchlistButton
                        >['watch']
                    }
                    size="md"
                    disabled={!user}
                />
            )}
            {content.data_type !== 'anime' && !preview && (
                <ReadlistButton
                    // TODO(phase2): drop cast
                    content_type={
                        content.data_type as ComponentProps<
                            typeof ReadlistButton
                        >['content_type']
                    }
                    slug={content.slug}
                    // TODO(phase2): drop cast
                    content={
                        content as unknown as ComponentProps<
                            typeof ReadlistButton
                        >['content']
                    }
                    // TODO(phase2): drop cast
                    read={
                        ((
                            content as
                                | MangaResponseWithRead
                                | NovelResponseWithRead
                        ).read?.[0] ?? null) as ComponentProps<
                            typeof ReadlistButton
                        >['read']
                    }
                    size="md"
                    disabled={!user}
                />
            )}
        </Card>
    );
};

export default FranchiseItem;
