import { type FC, useRef, useState } from 'react';

import { range } from '@antfu/utils';
import { keepPreviousData } from '@tanstack/react-query';
import { ChevronRight, Plus, Search } from 'lucide-react';

import type {
    CollectionContentTypeEnum,
    UserCollectionResponse,
} from '@hikka/api';
import { DEFAULT_CONTAINER_RATIO } from '@hikka/core';

import HorizontalCardSkeleton from '@/components/horizontal-card-skeleton';
import MaterialSymbolsStack from '@/components/icons/material-symbols/MaterialSymbolsStack';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BlockBleed from '@/components/ui/block-bleed';
import { buttonVariants } from '@/components/ui/button';
import ClearInputButton from '@/components/ui/clear-input-button';
import EmptyState from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import { USER_COLLECTIONS_PAGE_SIZE, userCollectionsOptions } from '../queries';
import CollectionEntryPanel from './collection-entry-panel';
import CollectionPickerItem from './collection-picker-item';
import { COLLECTION_PICKER_TITLE } from './constants';

const SEARCH_THRESHOLD = 6;
// Backend bound (`UserCollectionsArgs.query`, min_length=2).
const SEARCH_MIN_LENGTH = 2;
const NEW_COLLECTION_LABEL = 'Додати у нову колекцію';

type Props = {
    content_type: CollectionContentTypeEnum;
    slug: string;
};

const CollectionPickerItemSkeleton: FC = () => (
    <HorizontalCardSkeleton
        className="-mt-px gap-3 border-transparent border-y px-4 py-2 first:mt-0"
        imageClassName="w-9"
        action={<Skeleton className="size-4 shrink-0 rounded-sm" />}
    />
);

const CollectionPicker: FC<Props> = ({ content_type, slug }) => {
    const queryInputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<UserCollectionResponse | null>(
        null,
    );
    const [returnedFrom, setReturnedFrom] = useState<string>();
    const [debouncedQuery] = useDebounce({
        value: query.trim(),
        delay: DEBOUNCE_MS.input,
    });
    const search =
        debouncedQuery.length >= SEARCH_MIN_LENGTH ? debouncedQuery : undefined;

    const { list, pagination, ref, isError, isFetchingNextPage } =
        useInfiniteList({
            ...userCollectionsOptions(content_type, slug, search),
            placeholderData: keepPreviousData,
        });

    if (selected) {
        return (
            <div className="fade-in slide-in-from-right-4 animate-in duration-200 ease-out motion-reduce:animate-none">
                <CollectionEntryPanel
                    collection={selected}
                    slug={slug}
                    onBack={() => {
                        setSelected(null);
                        setReturnedFrom(selected.reference);
                    }}
                />
            </div>
        );
    }

    const rows = [...(list ?? [])].sort(
        (a, b) => Number(b.has_content) - Number(a.has_content),
    );
    const searching = query.trim().length > 0;

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

            {list?.length === 0 && !search ? (
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
                    {(searching ||
                        (pagination?.total ?? 0) > SEARCH_THRESHOLD) && (
                        <label className="flex h-9 items-center gap-2 rounded-md border bg-secondary/20 px-3 text-muted-foreground">
                            <Search className="size-4" />
                            <input
                                ref={queryInputRef}
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Пошук колекцій"
                                aria-label="Пошук колекцій"
                                className="min-w-0 flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
                            />
                            <ClearInputButton
                                disabled={!query}
                                className="-mr-2.5 size-7"
                                onClick={() => {
                                    setQuery('');
                                    queryInputRef.current?.focus();
                                }}
                            />
                        </label>
                    )}
                    <BlockBleed className="max-h-80 overflow-y-auto">
                        {list
                            ? rows.map((collection) => (
                                  <CollectionPickerItem
                                      key={collection.reference}
                                      collection={collection}
                                      focusOnMount={
                                          collection.reference === returnedFrom
                                      }
                                      onSelect={() => setSelected(collection)}
                                  />
                              ))
                            : !isError &&
                              range(0, USER_COLLECTIONS_PAGE_SIZE).map(
                                  (index) => (
                                      <CollectionPickerItemSkeleton
                                          key={index}
                                      />
                                  ),
                              )}
                        {isFetchingNextPage && <CollectionPickerItemSkeleton />}
                        {list && rows.length === 0 && (
                            <p className="py-4 text-center text-muted-foreground text-sm">
                                Нічого не знайдено
                            </p>
                        )}
                        {isError && (
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
