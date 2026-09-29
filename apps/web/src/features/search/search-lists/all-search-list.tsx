import { type ReactNode, useCallback } from 'react';

import { Ellipsis } from 'lucide-react';

import {
    ContentTypeEnum,
    searchAnimeInfiniteOptions,
    searchCharactersInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    searchPeopleInfiniteOptions,
} from '@hikka/api';

import { CommandItem } from '@/components/ui/command';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { useRouter } from '@/utils/navigation';

import SearchCard from '../components/search-card';
import SearchPlaceholders from '../components/search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../components/search-ui';
import { useSearchHistoryStore } from '../search-history-store';
import type { SearchContent, SearchTypeValue } from '../types';

const ALL_SEARCH_SIZE = 3;

type SearchResultGroupProps = {
    list: Array<{ slug: string }> | undefined;
    heading: string;
    contentType: ContentTypeEnum;
    renderCard: (item: any) => ReactNode;
    onSelect: (item: any) => void;
    onNavigate: () => void;
    /** Pickers stay in the modal, so they page in place instead of leaving. */
    isPicker?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
};

const SearchResultGroup = ({
    list,
    heading,
    contentType,
    renderCard,
    onSelect,
    onNavigate,
    isPicker,
    hasMore,
    onLoadMore,
}: SearchResultGroupProps) => {
    if (!list || list.length === 0) return null;

    const footerClassName =
        'justify-center rounded-none border-y text-muted-foreground';

    return (
        <SearchGroup heading={heading}>
            {list.map((item) => (
                <SearchItem
                    key={`${contentType}-${item.slug}`}
                    value={`${contentType}-${item.slug}`}
                    onSelect={() => onSelect(item)}
                >
                    {renderCard(item)}
                </SearchItem>
            ))}
            {isPicker ? (
                hasMore && (
                    <CommandItem
                        value={`load-more-${contentType}`}
                        onSelect={onLoadMore}
                        className={footerClassName}
                    >
                        <Ellipsis />
                        Показати ще
                    </CommandItem>
                )
            ) : (
                <CommandItem
                    value={`view-all-${contentType}`}
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
    onDismiss: (content: SearchContent) => void;
    onClose: () => void;
    onSwitchType: (type: SearchTypeValue) => void;
    type?: 'link' | 'button';
    value?: string;
};

const AllSearchList = ({
    onDismiss,
    onClose,
    onSwitchType,
    type,
    value,
}: Props) => {
    const router = useRouter();
    const addHistoryEntry = useSearchHistoryStore((state) => state.addEntry);
    const enabled = value !== undefined && value.length >= MIN_SEARCH_LENGTH;

    const anime = useInfiniteList(
        searchAnimeInfiniteOptions({
            body: { query: value },
            query: { size: ALL_SEARCH_SIZE },
        }),
        { enabled },
    );

    const manga = useInfiniteList(
        searchMangaInfiniteOptions({
            body: { query: value },
            query: { size: ALL_SEARCH_SIZE },
        }),
        { enabled },
    );

    const novel = useInfiniteList(
        searchNovelInfiniteOptions({
            body: { query: value },
            query: { size: ALL_SEARCH_SIZE },
        }),
        { enabled },
    );

    const characters = useInfiniteList(
        searchCharactersInfiniteOptions({
            body: { query: value },
            query: { size: ALL_SEARCH_SIZE },
        }),
        { enabled },
    );

    const people = useInfiniteList(
        searchPeopleInfiniteOptions({
            body: { query: value },
            query: { size: ALL_SEARCH_SIZE },
        }),
        { enabled },
    );

    const anyFetching =
        anime.isFetching ||
        manga.isFetching ||
        novel.isFetching ||
        characters.isFetching ||
        people.isFetching;

    const anyRefetching =
        anime.isRefetching ||
        manga.isRefetching ||
        novel.isRefetching ||
        characters.isRefetching ||
        people.isRefetching;

    const allLists = [
        anime.list,
        manga.list,
        novel.list,
        characters.list,
        people.list,
    ];
    const hasAnyData = allLists.some((list) => list !== undefined);
    const allEmpty =
        hasAnyData && allLists.every((list) => !list || list.length === 0);

    const placeholderData = !hasAnyData ? undefined : allEmpty ? [] : [1];

    const isPicker = type === 'button';

    const handleSelect = useCallback(
        (item: SearchContent, contentType: ContentTypeEnum) => {
            onDismiss(item);
            if (type !== 'button') {
                router.push(`${CONTENT_TYPE_LINKS[contentType]}/${item.slug}`);
            }
        },
        [onDismiss, router, type],
    );

    const handleNavigate = useCallback(
        (contentType: ContentTypeEnum) => {
            // Characters/people have no catalog page yet — switch the search
            // mode instead of navigating to a dead route.
            if (
                contentType === ContentTypeEnum.CHARACTER ||
                contentType === ContentTypeEnum.PERSON
            ) {
                onSwitchType(contentType);
                return;
            }

            if (value && value.trim().length >= MIN_SEARCH_LENGTH) {
                addHistoryEntry(value);
            }

            onClose();
            const path = CONTENT_TYPE_LINKS[contentType];
            router.push(
                path,
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

            <SearchResultGroup
                list={anime.list}
                heading="Аніме"
                contentType={ContentTypeEnum.ANIME}
                onSelect={(item) => handleSelect(item, ContentTypeEnum.ANIME)}
                onNavigate={() => handleNavigate(ContentTypeEnum.ANIME)}
                isPicker={isPicker}
                hasMore={anime.hasNextPage}
                onLoadMore={anime.fetchNextPage}
                renderCard={(item) => (
                    <SearchCard
                        content={item}
                        contentType="anime"
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={manga.list}
                heading="Манґа"
                contentType={ContentTypeEnum.MANGA}
                onSelect={(item) => handleSelect(item, ContentTypeEnum.MANGA)}
                onNavigate={() => handleNavigate(ContentTypeEnum.MANGA)}
                isPicker={isPicker}
                hasMore={manga.hasNextPage}
                onLoadMore={manga.fetchNextPage}
                renderCard={(item) => (
                    <SearchCard
                        content={item}
                        contentType="manga"
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={novel.list}
                heading="Ранобе"
                contentType={ContentTypeEnum.NOVEL}
                onSelect={(item) => handleSelect(item, ContentTypeEnum.NOVEL)}
                onNavigate={() => handleNavigate(ContentTypeEnum.NOVEL)}
                isPicker={isPicker}
                hasMore={novel.hasNextPage}
                onLoadMore={novel.fetchNextPage}
                renderCard={(item) => (
                    <SearchCard
                        content={item}
                        contentType="novel"
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={characters.list}
                heading="Персонажі"
                contentType={ContentTypeEnum.CHARACTER}
                onSelect={(item) =>
                    handleSelect(item, ContentTypeEnum.CHARACTER)
                }
                onNavigate={() => handleNavigate(ContentTypeEnum.CHARACTER)}
                isPicker={isPicker}
                hasMore={characters.hasNextPage}
                onLoadMore={characters.fetchNextPage}
                renderCard={(item) => (
                    <SearchCard
                        content={item}
                        contentType="character"
                        type={type}
                    />
                )}
            />

            <SearchResultGroup
                list={people.list}
                heading="Люди"
                contentType={ContentTypeEnum.PERSON}
                onSelect={(item) => handleSelect(item, ContentTypeEnum.PERSON)}
                onNavigate={() => handleNavigate(ContentTypeEnum.PERSON)}
                isPicker={isPicker}
                hasMore={people.hasNextPage}
                onLoadMore={people.fetchNextPage}
                renderCard={(item) => (
                    <SearchCard
                        content={item}
                        contentType="person"
                        type={type}
                    />
                )}
            />
        </SearchList>
    );
};

export default AllSearchList;
