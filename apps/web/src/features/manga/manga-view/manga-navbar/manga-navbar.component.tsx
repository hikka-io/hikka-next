'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useMangaBySlug, useSession } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import EditButton from '@/components/edit-button';
import FavoriteButton from '@/components/favorite-button';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import ReadlistButton from '@/components/readlist-button/readlist-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import { COMMENT_DECLENSIONS } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const MangaNavbar: FC<Props> = ({ className }) => {
    const params = useParams();
    const { user: loggedUser } = useSession();

    const { data: manga } = useMangaBySlug({
        slug: String(params.slug),
    });

    return (
        <div
            className={cn(
                'sticky bottom-3 z-10 mx-auto flex w-fit md:bottom-4',
                className,
            )}
        >
            <Card className="flex-row gap-2 border-none bg-secondary/60 px-3 py-2 backdrop-blur-xl">
                <ReadlistButton
                    slug={String(params.slug)}
                    size="icon-md"
                    content_type={ContentTypeEnum.MANGA}
                    buttonProps={{
                        variant: 'ghost',
                    }}
                />
                <FavoriteButton
                    slug={String(params.slug)}
                    content_type={ContentTypeEnum.MANGA}
                    size="icon-md"
                    variant="ghost"
                />

                <Button asChild size="md" variant="ghost">
                    <Link href={`/comments/manga/${params.slug}`}>
                        <IconamoonCommentFill className="size-4" />
                        <span>
                            {manga?.comments_count}{' '}
                            <span className="hidden sm:inline">
                                {getDeclensionWord(
                                    manga?.comments_count ?? 0,
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
                            content_type={ContentTypeEnum.MANGA}
                            size="icon-md"
                            variant="ghost"
                        />
                    </>
                )}
            </Card>
        </div>
    );
};

export default MangaNavbar;
