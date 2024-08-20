import Link from 'next/link';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import ReadlistButton from '@/components/readlist-button/readlist-button';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import WatchlistButton from '@/components/watchlist-button/watchlist-button';

import { MEDIA_TYPE } from '@/utils/constants';

interface Props {
    content: API.Anime | API.Manga | API.Novel;
}

const FranchiseItem: FC<Props> = ({ content }) => {
    return (
        <Card>
            <div className="flex gap-4">
                <ContentCard
                    href={`/${content.data_type}/${content.slug}`}
                    className="w-14"
                    image={content.image}
                />
                <div className="flex flex-1 flex-col gap-2">
                    <Label
                        asChild
                        className="line-clamp-1 cursor-pointer hover:underline"
                    >
                        <Link href={`/${content.data_type}/${content.slug}`}>
                            {content.title}
                        </Link>
                    </Label>
                    <div className="flex items-center gap-2">
                        {content.year && (
                            <Label className="text-xs text-muted-foreground">
                                {content.year}
                            </Label>
                        )}
                        {content.year && content.media_type && (
                            <div className="size-1 rounded-full bg-muted-foreground" />
                        )}
                        {content.media_type && (
                            <Label className="text-xs text-muted-foreground">
                                {MEDIA_TYPE[content.media_type].title_ua}
                            </Label>
                        )}
                    </div>
                </div>
            </div>
            {content.data_type === 'anime' && (
                <WatchlistButton
                    slug={content.slug}
                    anime={content}
                    watch={content.watch && content.watch[0]}
                    size="md"
                />
            )}
            {content.data_type !== 'anime' && (
                <ReadlistButton
                    content_type={content.data_type}
                    slug={content.slug}
                    content={content}
                    read={content.read && content.read[0]}
                    size="md"
                />
            )}
        </Card>
    );
};

export default FranchiseItem;
