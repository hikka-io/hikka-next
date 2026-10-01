import { useCallback } from 'react';

import { Ellipsis } from 'lucide-react';

import {
    ContentTypeEnum,
    getCollectionsInfiniteOptions,
    searchAnimeInfiniteOptions,
    searchCharactersInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    searchPeopleInfiniteOptions,
} from '@hikka/api';

import { CommandItem } from '@/components/ui/command';
import { useSearchHistoryStore } from '@/services/stores/search-history-store';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import {
    CONTENT_SEARCH_ENTITIES,
    type SearchEntity,
} from '../../search-entities';
import type {
    ContentSearchEntityType,
    SearchEntityType,
    SearchResult,
    SearchResultVariant,
    SearchTypeValue,
} from '../../types';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

const ALL_SEARCH_SIZE = 3;

/** Just the slice of `useInfiniteList` this view reads off each entity. */
type EntityResult = {
    list: SearchResult[] | undefined;
    isFetching: boolean;
    isRefetching: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
};

type SearchResultGroupProps = {
    entity: SearchEntity;
    list: SearchResult[] | undefined;
    onSelect: (item: SearchResult) => void;
    onNavigate: () => void;
    type?: SearchResultVariant;
    /** Pickers stay in the modal, so they page in place instead of leaving. */
    isPicker?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
};

const SearchResultGroup = ({
    entity,
    list,
    onSelect,
    onNavigate,
    type,
    isPicker,
    hasMore,
    onLoadMore,
}: SearchResultGroupProps) => {
    if (!list || list.length === 0) return null;

    const footerClassName =
        'justify-center rounded-none border-y text-muted-foreground';

    return (
        <SearchGroup heading={entity.heading}>
            {list.map((item) => {
                const href = entity.getHref(item);
                // No href means nothing to link to, key on or hand to cmdk.
                if (!href) return null;

                return (
                    <SearchItem
                        key={href}
                        value={href}
                        onSelect={() => onSelect(item)}
                    >
                        {entity.renderCard(item, href, type)}
                    </SearchItem>
                );
            })}
            {isPicker ? (
                hasMore && (
                    <CommandItem
                        value={`load-more-${entity.type}`}
                        onSelect={onLoadMore}
                        className={footerClassName}
                    >
                        <Ellipsis />
                        Показати ще
                    </CommandItem>
                )
            ) : (
                <CommandItem
                    value={`view-all-${entity.type}`}
                    onSelect={onNavigate}
                    className={footerClassName}
                >
                    <Ellipsis />
                    Показати всі результати
                </CommandItem>
            )}
        </SearchGroup>
    );
};

type Props = {
    onDismiss: (content: SearchResult) => void;
    onClose: () => void;
    onSwitchType: (type: SearchTypeValue) => void;
    allowedTypes?: SearchEntityType[];
    type?: SearchResultVariant;
    value?: string;
};

const AllSearchList = ({
    onDismiss,
    onClose,
    onSwitchType,
    allowedTypes,
    type,
    value,
}: Props) => {
    const router = useRouter();
    const addHistoryEntry = useSearchHistoryStore((state) => state.addEntry);
    const enabled = value !== undefined && value.length >= MIN_SEARCH_LENGTH;

    const isAllowed = (entityType: SearchEntityType) =>
        !allowedTypes?.length || allowedTypes.includes(entityType);

    const enabledFor = (entityType: SearchEntityType) =>
        enabled && isAllowed(entityType);

    const body = { query: value };
    const query = { size: ALL_SEARCH_SIZE };

    // The hooks stay written out instead of mapped over the registry: a hook
    // cannot be called from a loop. The registry still owns order, headings,
    // cards, hrefs and the catalog/switch decision below — the record's key type
    // is what keeps the two in step, since a new searchable entity turns a
    // missing hook here into a compile error instead of an undefined result.
    const results: Record<ContentSearchEntityType, EntityResult> = {
        [ContentTypeEnum.ANIME]: useInfiniteList(
            searchAnimeInfiniteOptions({ body, query }),
            { enabled: enabledFor(ContentTypeEnum.ANIME) },
        ),
        [ContentTypeEnum.MANGA]: useInfiniteList(
            searchMangaInfiniteOptions({ body, query }),
            { enabled: enabledFor(ContentTypeEnum.MANGA) },
        ),
        [ContentTypeEnum.NOVEL]: useInfiniteList(
            searchNovelInfiniteOptions({ body, query }),
            { enabled: enabledFor(ContentTypeEnum.NOVEL) },
        ),
        [ContentTypeEnum.CHARACTER]: useInfiniteList(
            searchCharactersInfiniteOptions({ body, query }),
            { enabled: enabledFor(ContentTypeEnum.CHARACTER) },
        ),
        [ContentTypeEnum.COLLECTION]: useInfiniteList(
            getCollectionsInfiniteOptions({ body, query }),
            { enabled: enabledFor(ContentTypeEnum.COLLECTION) },
        ),
        [ContentTypeEnum.PERSON]: useInfiniteList(
            searchPeopleInfiniteOptions({ body, query }),
            { enabled: enabledFor(ContentTypeEnum.PERSON) },
        ),
    };

    const entities = CONTENT_SEARCH_ENTITIES.filter((entity) =>
        isAllowed(entity.type),
    );
    const visible = entities.map((entity) => results[entity.type]);

    const anyFetching = visible.some((result) => result.isFetching);
    const anyRefetching = visible.some((result) => result.isRefetching);

    const allLists = visible.map((result) => result.list);
    const hasAnyData = allLists.some((list) => list !== undefined);
    const allEmpty =
        hasAnyData && allLists.every((list) => !list || list.length === 0);

    const placeholderData = !hasAnyData ? undefined : allEmpty ? [] : [1];

    const isPicker = type === 'button';

    const handleSelect = useCallback(
        (item: SearchResult, entity: SearchEntity) => {
            onDismiss(item);

            const href = entity.getHref(item);
            if (type !== 'button' && href) {
                router.push(href);
            }
        },
        [onDismiss, router, type],
    );

    const handleNavigate = useCallback(
        (entity: SearchEntity) => {
            // Without a catalog that takes `?search=`, switching the search
            // mode beats navigating to a page that drops the query.
            if (!entity.hasCatalog) {
                onSwitchType(entity.type);
                return;
            }

            if (value && value.trim().length >= MIN_SEARCH_LENGTH) {
                addHistoryEntry(value);
            }

            onClose();
            router.push(
                entity.routePrefix,
                value ? { search: { search: value } } : undefined,
            );
        },
        [addHistoryEntry, onClose, onSwitchType, router, value],
    );

    return (
        <SearchList>
            <SearchPlaceholders
                data={placeholderData}
                isFetching={anyFetching}
                isRefetching={anyRefetching}
            />

            {entities.map((entity) => {
                const result = results[entity.type];

                return (
                    <SearchResultGroup
                        key={entity.type}
                        entity={entity}
                        list={result.list}
                        onSelect={(item) => handleSelect(item, entity)}
                        onNavigate={() => handleNavigate(entity)}
                        type={type}
                        isPicker={isPicker}
                        hasMore={result.hasNextPage}
                        onLoadMore={result.fetchNextPage}
                    />
                );
            })}
        </SearchList>
    );
};

export default AllSearchList;
