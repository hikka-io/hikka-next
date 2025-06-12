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
        <div className="sticky bottom-2 flex justify-center z-10">
            <Card className="flex-row gap-2 p-2 bg-background/60 backdrop-blur-xl border-none">
                <CollectionVote collection={collection!} />

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

                {collection && (
                    <FavoriteButton
                        size="icon-md"
                        variant="secondary"
                        content_type={ContentTypeEnum.COLLECTION}
                        slug={collection?.reference}
                    />
                )}

                <CollectionMenu collection={collection!} />
            </Card>
        </div>
    );
};

export default CollectionNavbar;
