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
import WatchlistButton from '@/components/watchlist-button/watchlist-button';

import { COMMENT_DECLENSIONS } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';
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
            className={cn('sticky bottom-4 z-10 mx-auto flex w-fit', className)}
        >
            <Card className="bg-secondary/60 flex-row gap-2 border-none px-3 py-2 backdrop-blur-xl">
                <WatchlistButton
                    buttonProps={{
                        variant: 'ghost',
                    }}
                    slug={String(params.slug)}
                    size="icon-md"
                />
                <FavoriteButton
                    slug={String(params.slug)}
                    content_type={ContentTypeEnum.ANIME}
                    size="icon-md"
                    variant="ghost"
                />

                <Button asChild size="md" variant="ghost">
                    <Link href={`/comments/anime/${params.slug}`}>
                        <IconamoonCommentFill className="size-4" />
                        <span>
                            {anime?.comments_count}{' '}
                            <span className="hidden sm:inline">
                                {getDeclensionWord(
                                    anime?.comments_count ?? 0,
                                    COMMENT_DECLENSIONS,
                                )}
                            </span>
                        </span>
                    </Link>
                </Button>

                {loggedUser && (
                    <>
                        <div className="bg-secondary h-full w-px" />
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type={ContentTypeEnum.ANIME}
                            size="icon-md"
                            variant="ghost"
                        />
                    </>
                )}
            </Card>
        </div>
    );
};

export default AnimeNavbar;
