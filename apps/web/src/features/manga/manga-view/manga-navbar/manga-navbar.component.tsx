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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

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
                'sticky bottom-2 z-10 flex justify-center',
                className,
            )}
        >
            <Card className="flex-row gap-2 bg-background/60 p-2 backdrop-blur-xl">
                <ReadlistButton
                    slug={String(params.slug)}
                    size="icon-md"
                    content_type={ContentTypeEnum.MANGA}
                />
                <FavoriteButton
                    slug={String(params.slug)}
                    content_type={ContentTypeEnum.MANGA}
                    size="icon-md"
                    variant="secondary"
                />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild size="md" variant="secondary">
                            <Link href={`/comments/manga/${params.slug}`}>
                                <IconamoonCommentFill className="size-4" />
                                {manga?.comments_count}
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Коментарі</TooltipContent>
                </Tooltip>

                {loggedUser && (
                    <EditButton
                        key={String(params.slug)}
                        slug={String(params.slug)}
                        content_type={ContentTypeEnum.MANGA}
                        size="icon-md"
                        variant="secondary"
                    />
                )}
            </Card>
        </div>
    );
};

export default MangaNavbar;
