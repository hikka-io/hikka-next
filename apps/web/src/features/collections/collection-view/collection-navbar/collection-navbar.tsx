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
import { getDeclensionWord } from '@/utils/i18n/declension';
import { COMMENT_FORMS } from '@/utils/i18n/word-forms';
import { Link, useParams } from '@/utils/navigation';

import CollectionViewActionsMenu from '../collection-actions-menu';
import CollectionToc from '../collection-toc';
import CollectionVote from './collection-vote';

type Props = {};

const CollectionViewNavbar: FC<Props> = () => {
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

                <Button
                    size="md"
                    variant="ghost"
                    render={
                        <Link to={`/comments/collection/${params.reference}`} />
                    }
                >
                    <MessageCircle />
                    <span>
                        {collection?.comments_count}{' '}
                        <span className="hidden sm:inline">
                            {getDeclensionWord(
                                collection?.comments_count ?? 0,
                                COMMENT_FORMS,
                            )}
                        </span>
                    </span>
                </Button>

                {collection?.labels_order.length !== 0 && (
                    <Popover>
                        <PopoverTrigger
                            render={
                                <Button
                                    className="flex lg:hidden"
                                    size="md"
                                    variant="ghost"
                                />
                            }
                        >
                            <TableOfContents className="size-4" />
                        </PopoverTrigger>

                        <PopoverContent
                            align="end"
                            side="top"
                            className="w-64 p-0"
                        >
                            <CollectionToc className="max-h-96 border-none" />
                        </PopoverContent>
                    </Popover>
                )}

                <div className="hidden h-full w-px bg-border md:block" />
                <CollectionViewActionsMenu className="hidden md:flex" />
            </Card>
        </div>
    );
};

export default CollectionViewNavbar;
