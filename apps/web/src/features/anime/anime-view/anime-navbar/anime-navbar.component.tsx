'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useAnimeBySlug, useSession } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import EditButton from '@/components/edit-button';
import FavoriteButton from '@/components/favorite-button';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import WatchlistButton from '@/components/watchlist-button/watchlist-button';

import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const AnimeNavbar: FC<Props> = ({ className }) => {
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data: anime } = useAnimeBySlug({
        slug: String(params.slug),
    });

    return (
        <div
            className={cn(
                'sticky bottom-2 z-10 flex justify-center',
                className,
            )}
        >
            <Card className="flex-row gap-2 bg-background/60 p-2 backdrop-blur-xl">
                <WatchlistButton slug={String(params.slug)} size="icon-md" />
                <FavoriteButton
                    slug={String(params.slug)}
                    content_type={ContentTypeEnum.ANIME}
                    size="icon-md"
                    variant="secondary"
                />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild size="md" variant="secondary">
                            <Link href={`/comments/anime/${params.slug}`}>
                                <IconamoonCommentFill className="size-4" />
                                {anime?.comments_count}
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Коментарі</TooltipContent>
                </Tooltip>

                {loggedUser && (
                    <EditButton
                        key={String(params.slug)}
                        slug={String(params.slug)}
                        content_type={ContentTypeEnum.ANIME}
                        size="icon-md"
                        variant="secondary"
                    />
                )}
            </Card>
        </div>
    );
};

export default AnimeNavbar;
