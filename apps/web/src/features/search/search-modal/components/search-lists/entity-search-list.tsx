import { useCallback } from 'react';

import { Ellipsis } from 'lucide-react';

import {
    ContentTypeEnum,
    searchAnimeInfiniteOptions,
    searchCharactersInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    searchPeopleInfiniteOptions,
} from '@hikka/api';

import LoadMoreButton from '@/components/load-more-button';
import { CommandItem } from '@/components/ui/command';
import { useSearchHistoryStore } from '@/services/stores/search-history-store';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import type { SearchContent } from '../../types';
import SearchCard, { type SearchCardType } from '../cards/search-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

type OptionsFn = typeof searchAnimeInfiniteOptions;

const LIST_CONFIG: Record<
    SearchCardType,
    {
        options: OptionsFn;
        href: string;
        contentType: ContentTypeEnum;
        hasCatalog: boolean;
    }
> = {
    anime: {
        options: searchAnimeInfiniteOptions,
        href: '/anime',
        contentType: ContentTypeEnum.ANIME,
        hasCatalog: true,
    },
    manga: {
        options: searchMangaInfiniteOptions as unknown as OptionsFn,
        href: '/manga',
        contentType: ContentTypeEnum.MANGA,
        hasCatalog: true,
    },
    novel: {
        options: searchNovelInfiniteOptions as unknown as OptionsFn,
        href: '/novel',
        contentType: ContentTypeEnum.NOVEL,
        hasCatalog: true,
    },
    // Characters/people have no catalog page yet — no "view all" target.
    character: {
        options: searchCharactersInfiniteOptions as unknown as OptionsFn,
        href: '/characters',
        contentType: ContentTypeEnum.CHARACTER,
        hasCatalog: false,
    },
    person: {
        options: searchPeopleInfiniteOptions as unknown as OptionsFn,
        href: '/people',
        contentType: ContentTypeEnum.PERSON,
        hasCatalog: false,
    },
};

type Props = {
    contentType: SearchCardType;
    onDismiss: (content: SearchContent) => void;
    onClose: () => void;
    type?: 'link' | 'button';
    value?: string;
};

const EntitySearchList = ({
    contentType,
    onDismiss,
    onClose,
    type,
    value,
}: Props) => {
    const router = useRouter();
    const addHistoryEntry = useSearchHistoryStore((state) => state.addEntry);
    const config = LIST_CONFIG[contentType];

    const handleSelect = useCallback(
        (item: SearchContent) => {
            onDismiss(item);

            if (type !== 'button') {
                router.push(`${config.href}/${item.slug}`);
            }
        },
        [onDismiss, router, type, config.href],
    );

    const handleNavigate = useCallback(() => {
        if (value && value.trim().length >= MIN_SEARCH_LENGTH) {
            addHistoryEntry(value, config.contentType);
        }

        onClose();
        router.push(
            config.href,
            value ? { search: { search: value } } : undefined,
        );
    }, [
        addHistoryEntry,
        config.contentType,
        onClose,
        router,
        value,
        config.href,
    ]);

    const {
        list,
        isFetching,
        isRefetching,
        ref,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList(
        config.options({
            body: { query: value },
            query: { size: 30 },
        }),
        {
            enabled: value !== undefined && value.length >= MIN_SEARCH_LENGTH,
        },
    );

    return (
        <SearchList>
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <SearchGroup>
                    {list.map((item) => (
                        <SearchItem
                            key={item.slug}
                            value={item.slug}
                            onSelect={() => handleSelect(item)}
                        >
                            <SearchCard
                                onClick={() => onDismiss(item)}
                                content={item}
                                contentType={contentType}
                                type={type}
                            />
                        </SearchItem>
                    ))}
                    {config.hasCatalog && (
                        <CommandItem
                            value={`view-all-${contentType}`}
                            onSelect={handleNavigate}
                            className="justify-center rounded-none border-y text-muted-foreground"
                        >
                            <Ellipsis />
                            Показати всі результати
                        </CommandItem>
                    )}
                </SearchGroup>
            )}
            <div className="flex items-center justify-center">
                {hasNextPage && (
                    <LoadMoreButton
                        ref={ref}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </SearchList>
    );
};

export default EntitySearchList;
