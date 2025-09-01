import { AnimeResponse, MangaResponse, NovelResponse } from '@hikka/client';
import { useSession } from '@hikka/react';
import { FC } from 'react';

import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { MEDIA_TYPE } from '@/utils/constants/common';

import ReadlistButton from '@/components/readlist-button/readlist-button';
import P from '@/components/typography/p';
import WatchlistButton from '@/components/watchlist-button/watchlist-button';

interface Props {
    content: AnimeResponse | MangaResponse | NovelResponse;
    preview?: boolean;
}

const FranchiseItem: FC<Props> = ({ content, preview }) => {
    const { user } = useSession();
    return (
        <Card>
            <HorizontalCard href={`/${content.data_type}/${content.slug}`}>
                <HorizontalCardImage image={content.image} />
                <HorizontalCardContainer>
                    <HorizontalCardTitle>{content.title}</HorizontalCardTitle>
                    <HorizontalCardDescription>
                        {content.year && <P>{content.year}</P>}
                        {content.year && content.media_type && (
                            <div className="bg-muted-foreground size-1 rounded-full" />
                        )}
                        {content.media_type && (
                            <P>{MEDIA_TYPE[content.media_type].title_ua}</P>
                        )}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCard>
            {content.data_type === 'anime' && !preview && (
                <WatchlistButton
                    slug={content.slug}
                    anime={content}
                    watch={(content.watch && content.watch[0]) ?? null}
                    size="md"
                    disabled={!user}
                />
            )}
            {content.data_type !== 'anime' && !preview && (
                <ReadlistButton
                    content_type={content.data_type}
                    slug={content.slug}
                    content={content}
                    read={(content.read && content.read[0]) ?? null}
                    size="md"
                    disabled={!user}
                />
            )}
        </Card>
    );
};

export default FranchiseItem;
