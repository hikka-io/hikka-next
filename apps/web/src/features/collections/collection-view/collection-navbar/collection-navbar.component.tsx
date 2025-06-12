'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useCollectionByReference } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import FavoriteButton from '@/components/favorite-button';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import CollectionMenu from './collection-menu';
import CollectionVote from './collection-vote';

interface Props {}

const CollectionNavbar: FC<Props> = () => {
    const params = useParams();

    const { data: collection } = useCollectionByReference({
        reference: String(params.reference),
    });

    return (
        <div className="sticky bottom-2 z-10 flex justify-center">
            <Card className="flex-row gap-2 border-none bg-background/60 p-2 backdrop-blur-xl">
                <CollectionVote collection={collection!} />
                {collection && (
                    <FavoriteButton
                        size="icon-md"
                        variant="secondary"
                        content_type={ContentTypeEnum.COLLECTION}
                        slug={collection?.reference}
                    />
                )}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild size="md" variant="secondary">
                            <Link
                                href={
                                    '/comments' +
                                    '/collection' +
                                    '/' +
                                    params.reference
                                }
                            >
                                <IconamoonCommentFill className="size-4" />
                                {collection?.comments_count}
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Коментарі</TooltipContent>
                </Tooltip>

                <CollectionMenu collection={collection!} />
            </Card>
        </div>
    );
};

export default CollectionNavbar;
