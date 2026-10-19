import { type FC, useEffect, useState } from 'react';

import { range } from '@antfu/utils';
import { ChevronRight, Plus, Search } from 'lucide-react';

import type { CollectionContentTypeEnum, CollectionResponse } from '@hikka/api';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BlockBleed from '@/components/ui/block-bleed';
import { buttonVariants } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import {
    OWN_COLLECTIONS_PAGE_SIZE,
    ownCollectionsOptions,
    ownContentCollectionsOptions,
} from '../queries';
import CollectionEntryPanel from './collection-entry-panel';
import CollectionPickerItem from './collection-picker-item';
import { COLLECTION_PICKER_TITLE } from './constants';

const SEARCH_THRESHOLD = 6;
const NEW_COLLECTION_LABEL = 'Додати у нову колекцію';

type Props = {
    content_type: CollectionContentTypeEnum;
    slug: string;
    username: string;
};

const CollectionPickerItemSkeleton: FC = () => (
    <HorizontalCardSkeleton
        className="-mt-px gap-3 border-transparent border-y px-4 py-2 first:mt-0"
        imageClassName="w-9"
        action={<Skeleton className="size-4 shrink-0 rounded-sm" />}
    />
);

const CollectionPicker: FC<Props> = ({ content_type, slug, username }) => {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<CollectionResponse | null>(null);
    const [returnedFrom, setReturnedFrom] = useState<string>();

    const {
        list,
        pagination,
        ref,
        isError: listError,
        isFetchingNextPage,
    } = useInfiniteList(ownCollectionsOptions(username, content_type));
    const membershipOptions = ownContentCollectionsOptions(
        username,
        content_type,
        slug,
    );
    const {
        list: memberships,
        isError: membershipError,
        hasNextPage: moreMemberships,
        isFetchingNextPage: fetchingMemberships,
        fetchNextPage: fetchMoreMemberships,
    } = useInfiniteList(membershipOptions);

    useEffect(() => {
        if (moreMemberships && !fetchingMemberships) fetchMoreMemberships();
    }, [moreMemberships, fetchingMemberships, fetchMoreMemberships]);

    const memberReferences = new Set(
        memberships?.map((collection) => collection.reference),
    );
    const loaded = Boolean(list && memberships && !moreMemberships);
    const failed = listError || membershipError;

    if (selected) {
        return (
            <div className="fade-in slide-in-from-right-4 animate-in duration-200 ease-out motion-reduce:animate-none">
                <CollectionEntryPanel
                    collection={selected}
                    slug={slug}
                    member={memberReferences.has(selected.reference)}
                    membershipKey={membershipOptions.queryKey}
                    onBack={() => {
                        setSelected(null);
                        setReturnedFrom(selected.reference);
                    }}
                />
            </div>
        );
    }

    // Members come from their own query, so they lead the list even when their page of the paged list is not loaded yet.
    const needle = query.trim().toLowerCase();
    const rows = [
        ...(memberships ?? []),
        ...(list ?? []).filter(
            (collection) => !memberReferences.has(collection.reference),
        ),
    ].filter(
        (collection) =>
            !needle || collection.title.toLowerCase().includes(needle),
    );

    return (
        <div
            className={cn(
                'flex flex-col gap-3',
                returnedFrom &&
                    'fade-in slide-in-from-left-4 animate-in duration-200 ease-out motion-reduce:animate-none',
            )}
        >
            <h2 className="flex h-10 items-center font-semibold text-sm">
                {COLLECTION_PICKER_TITLE}
            </h2>

            {list?.length === 0 ? (
                <EmptyState
                    size="sm"
                    icon={<MaterialSymbolsStack />}
                    title="У вас ще немає колекцій цього типу"
                    description="Створіть колекцію і почніть з цього запису"
                    action={
                        <Link
                            to="/collections/new"
                            search={{ content_type, slug }}
                            className={buttonVariants({ size: 'md' })}
                        >
                            <Plus />
                            {NEW_COLLECTION_LABEL}
                        </Link>
                    }
                />
            ) : (
                <>
                    {(pagination?.total ?? 0) > SEARCH_THRESHOLD && (
                        <label className="flex h-9 items-center gap-2 rounded-md border bg-secondary/20 px-3 text-muted-foreground">
                            <Search className="size-4" />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Пошук колекцій"
                                aria-label="Пошук колекцій"
                                className="min-w-0 flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </label>
                    )}
                    <BlockBleed className="max-h-80 overflow-y-auto">
                        {loaded
                            ? rows.map((collection) => (
                                  <CollectionPickerItem
                                      key={collection.reference}
                                      collection={collection}
                                      member={memberReferences.has(
                                          collection.reference,
                                      )}
                                      focusOnMount={
                                          collection.reference === returnedFrom
                                      }
                                      onSelect={() => setSelected(collection)}
                                  />
                              ))
                            : !failed &&
                              range(0, OWN_COLLECTIONS_PAGE_SIZE).map(
                                  (index) => (
                                      <CollectionPickerItemSkeleton
                                          key={index}
                                      />
                                  ),
                              )}
                        {isFetchingNextPage && <CollectionPickerItemSkeleton />}
                        {loaded && rows.length === 0 && (
                            <p className="py-4 text-center text-muted-foreground text-sm">
                                Нічого не знайдено
                            </p>
                        )}
                        {failed && (
                            <p className="px-4 py-4 text-center text-muted-foreground text-sm">
                                Не вдалося завантажити колекції
                            </p>
                        )}
                        <div ref={ref} />
                    </BlockBleed>
                    <BlockBleed className="-mb-4 border-t">
                        <Link
                            to="/collections/new"
                            search={{ content_type, slug }}
                            className="flex items-center gap-3 px-4 py-2 transition-colors duration-100 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                        >
                            <div className="w-9 shrink-0">
                                <AspectRatio ratio={DEFAULT_CONTAINER_RATIO}>
                                    <span className="flex size-full items-center justify-center rounded-(--base-radius) border border-muted-foreground/40 border-dashed bg-secondary/20 text-muted-foreground">
                                        <Plus className="size-4" />
                                    </span>
                                </AspectRatio>
                            </div>
                            <span className="min-w-0 flex-1 truncate font-medium text-sm">
                                {NEW_COLLECTION_LABEL}
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                        </Link>
                    </BlockBleed>
                </>
            )}
        </div>
    );
};

export default CollectionPicker;
