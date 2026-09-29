import type { ComponentProps, FC } from 'react';

import { useQuery } from '@tanstack/react-query';
import { TableOfContents } from 'lucide-react';

import { ContentTypeEnum, getCollectionOptions } from '@hikka/api';

import {
    CommentsCountButton,
    FavoriteButton,
    VoteButton,
} from '@/components/action-buttons';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useParams } from '@/utils/navigation';

import CollectionViewActionsMenu from '../collection-actions-menu';
import CollectionToc from '../collection-toc';

type Props = {};

const CollectionViewNavbar: FC<Props> = () => {
    const params = useParams();

    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference: String(params.reference) } }),
    );

    const { reference, my_score: myScore, vote_score: voteScore } = collection!;

    return (
        <div className="sticky bottom-[calc(var(--tab-bar-height)+1rem)] z-10 mx-auto flex w-fit">
            <Card variant="glass" className="flex-row gap-2 px-3 py-2">
                <VoteButton
                    variant="card"
                    contentType={ContentTypeEnum.COLLECTION}
                    slug={reference}
                    myScore={myScore}
                    voteScore={voteScore}
                />
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

                <CommentsCountButton
                    to={`/comments/collection/${params.reference}`}
                    count={collection?.comments_count}
                />

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
