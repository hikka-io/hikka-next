import type { ComponentProps, FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { MessageCircle, TableOfContents } from 'lucide-react';

import { ContentTypeEnum, getCollectionOptions } from '@hikka/api';

import FavoriteButton from '@/components/action-buttons/favorite-button';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { COMMENT_DECLENSIONS } from '@/utils/constants/common';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link, useParams } from '@/utils/navigation';

import TableOfContentsComponent from '../../table-of-contents';
import CollectionActionsMenu from '../collection-actions-menu';
import CollectionVote from './components/collection-vote';

type Props = {};

const CollectionNavbar: FC<Props> = () => {
    const params = useParams();

    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference: String(params.reference) } }),
    );

    return (
        <div className="sticky bottom-[calc(var(--tab-bar-height)+1rem)] z-10 mx-auto flex w-fit">
            <Card variant="glass" className="flex-row gap-2 px-3 py-2">
                <CollectionVote collection={collection!} />
                {collection && (
                    <FavoriteButton
                        size="icon-md"
                        variant="ghost"
                        content_type={
                            ContentTypeEnum.COLLECTION as ComponentProps<
                                typeof FavoriteButton
                            >['content_type']
                        }
                        slug={collection?.reference}
                    />
                )}

                <Button asChild size="md" variant="ghost">
                    <Link to={`/comments/collection/${params.reference}`}>
                        <MessageCircle />
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

                        <PopoverContent
                            align="end"
                            side="top"
                            className="w-64 p-0"
                        >
                            <TableOfContentsComponent className="max-h-96 border-none" />
                        </PopoverContent>
                    </Popover>
                )}

                <div className="hidden h-full w-px bg-border md:block" />
                <CollectionActionsMenu className="hidden md:flex" />
            </Card>
        </div>
    );
};

export default CollectionNavbar;
