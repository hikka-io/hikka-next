'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import EditButton from '@/components/edit-button';
import FavoriteButton from '@/components/favorite-button';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import ReadlistButton from '@/components/readlist-button/readlist-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import WatchlistButton from '@/components/watchlist-button/watchlist-button';

import { COMMENT_DECLENSIONS, CONTENT_CONFIG } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL
        | ContentTypeEnum.CHARACTER
        | ContentTypeEnum.PERSON;
}

const UserlistButton = ({ content_type }: Props) => {
    const params = useParams();

    switch (content_type) {
        case ContentTypeEnum.ANIME:
            return (
                <WatchlistButton slug={String(params.slug)} size="icon-md" />
            );
        case ContentTypeEnum.MANGA:
        case ContentTypeEnum.NOVEL:
            return (
                <ReadlistButton
                    slug={String(params.slug)}
                    size="icon-md"
                    content_type={content_type}
                />
            );
        case ContentTypeEnum.PERSON:
        case ContentTypeEnum.CHARACTER:
            return null;
        default:
            return null;
    }
};

const Navbar: FC<Props> = ({ className, content_type }) => {
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    return (
        <div
            className={cn(
                'sticky bottom-3 z-10 mx-auto flex w-fit md:bottom-4',
                className,
            )}
        >
            <Card className="flex-row gap-2 border-none bg-secondary/60 px-3 py-2 backdrop-blur-xl">
                <UserlistButton content_type={content_type} />
                {content_type !== ContentTypeEnum.PERSON && (
                    <FavoriteButton
                        slug={String(params.slug)}
                        content_type={content_type}
                        size="icon-md"
                        variant="ghost"
                    />
                )}

                <Button asChild size="md" variant="ghost">
                    <Link href={`/comments/${content_type}/${params.slug}`}>
                        <IconamoonCommentFill className="size-4" />
                        {data?.data_type !== ContentTypeEnum.CHARACTER &&
                            data?.data_type !== ContentTypeEnum.PERSON && (
                                <span>
                                    {data?.comments_count}{' '}
                                    <span className="hidden sm:inline">
                                        {getDeclensionWord(
                                            data?.comments_count ?? 0,
                                            COMMENT_DECLENSIONS,
                                        )}
                                    </span>
                                </span>
                            )}
                        {(data?.data_type === ContentTypeEnum.CHARACTER ||
                            data?.data_type === ContentTypeEnum.PERSON) && (
                            <span className="hidden sm:inline">Коментарі</span>
                        )}
                    </Link>
                </Button>

                {loggedUser && (
                    <>
                        <div className="h-full w-px bg-secondary" />
                        <EditButton
                            key={String(params.slug)}
                            slug={String(params.slug)}
                            content_type={content_type}
                            size="icon-md"
                            variant="ghost"
                        />
                    </>
                )}
            </Card>
        </div>
    );
};

export default Navbar;
