import { type FC, useState } from 'react';

import { range } from '@antfu/utils';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import {
    CollectionItem,
    CollectionItemSkeleton,
} from '@/components/list-items';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { CollectionListModal } from '@/features/collections';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link, useParams } from '@/utils/navigation';

import { COLLECTIONS_PREVIEW_SIZE, userCollectionsOptions } from '../queries';

type Props = {
    className?: string;
};

const UserCollections: FC<Props> = ({ className }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { user: loggedUser } = useSession();

    const username = String(params.username);

    const { ref, visible } = useVisibleOnce();
    const {
        list: collections,
        pagination,
        isPending,
    } = useInfiniteList(userCollectionsOptions(username, { preview: true }), {
        enabled: visible,
    });

    const isOwner = loggedUser?.username === params.username;
    const hidden =
        !isPending && (!collections || (collections.length === 0 && !isOwner));

    return (
        <>
            <div ref={ref}>
                {!hidden && (
                    <Block
                        variant="card"
                        className={cn(className)}
                        id="user-collections"
                    >
                        <Header>
                            <HeaderTitle
                                onClick={
                                    collections && collections.length > 0
                                        ? () => setOpen(true)
                                        : undefined
                                }
                                count={pagination?.total}
                                countPending={!collections}
                            >
                                Колекції
                            </HeaderTitle>
                            {isOwner && collections && (
                                <HeaderActions>
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    size="icon-sm"
                                                    variant="outline"
                                                    aria-label="Нова колекція"
                                                    render={
                                                        <Link to="/collections/new" />
                                                    }
                                                />
                                            }
                                        >
                                            <MaterialSymbolsAddRounded />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Нова колекція
                                        </TooltipContent>
                                    </Tooltip>
                                </HeaderActions>
                            )}
                        </Header>

                        <div className="flex flex-col gap-6">
                            {!collections &&
                                range(0, COLLECTIONS_PREVIEW_SIZE).map(
                                    (index) => (
                                        <CollectionItemSkeleton key={index} />
                                    ),
                                )}
                            {collections
                                ?.slice(0, COLLECTIONS_PREVIEW_SIZE)
                                .map((item) => (
                                    <CollectionItem
                                        data={item}
                                        key={item.reference}
                                    />
                                ))}
                            {collections?.length === 0 && (
                                <EmptyState
                                    icon={<MaterialSymbolsGridViewRounded />}
                                    title="Колекції відсутні"
                                    description="Створіть свою першу колекцію"
                                    action={
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            render={
                                                <Link to="/collections/new" />
                                            }
                                        >
                                            <MaterialSymbolsAddRounded />
                                            Створити колекцію
                                        </Button>
                                    }
                                />
                            )}
                        </div>
                    </Block>
                )}
            </div>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Колекції">
                    <CollectionListModal
                        options={userCollectionsOptions(username)}
                        emptyState={
                            <EmptyState
                                icon={<MaterialSymbolsGridViewRounded />}
                                title="Колекції відсутні"
                                description="Тут з’являться колекції цього користувача"
                            />
                        }
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default UserCollections;
