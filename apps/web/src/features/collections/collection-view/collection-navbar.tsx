'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useCollectionByReference, useSession } from '@hikka/react';
import { TableOfContents } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC, Fragment } from 'react';

import FavoriteButton from '@/components/favorite-button';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { COMMENT_DECLENSIONS } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';

import CollectionMenu from './components/collection-navbar/collection-menu';
import CollectionVote from './components/collection-navbar/collection-vote';
import TableOfContentsComponent from './table-of-contents';

interface Props {}

const CollectionNavbar: FC<Props> = () => {
    const { user: loggedUser, isAdmin, isModerator } = useSession();
    const params = useParams();

    const { data: collection } = useCollectionByReference({
        reference: String(params.reference),
    });

    return (
        <div className="sticky bottom-3 z-10 mx-auto flex w-fit md:bottom-4">
            <Card className="flex-row gap-2 border-none bg-secondary/60 px-3 py-2 backdrop-blur-xl">
                <CollectionVote collection={collection!} />
                {collection && (
                    <FavoriteButton
                        size="icon-md"
                        variant="ghost"
                        content_type={ContentTypeEnum.COLLECTION}
                        slug={collection?.reference}
                    />
                )}

                <Button asChild size="md" variant="ghost">
                    <Link
                        href={
                            '/comments' + '/collection' + '/' + params.reference
                        }
                    >
                        <IconamoonCommentFill className="size-4" />
                        <span>
                            {collection?.comments_count}{' '}
                            <span className="hidden sm:inline">
                                {getDeclensionWord(
                                    collection?.comments_count ?? 0,
                                    COMMENT_DECLENSIONS,
                                )}
                            </span>
                        </span>
                    </Link>
                </Button>

                {collection?.labels_order.length !== 0 && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="flex lg:hidden"
                                size="md"
                                variant="ghost"
                            >
                                <TableOfContents className="size-4" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent align="end" className="w-64 p-0">
                            <TableOfContentsComponent className="max-h-96 border-none" />
                        </PopoverContent>
                    </Popover>
                )}

                {(loggedUser?.username === collection?.author.username ||
                    isAdmin() ||
                    isModerator()) && (
                    <Fragment>
                        <div className="h-full w-px bg-secondary" />
                        <CollectionMenu collection={collection!} />
                    </Fragment>
                )}
            </Card>
        </div>
    );
};

export default CollectionNavbar;
