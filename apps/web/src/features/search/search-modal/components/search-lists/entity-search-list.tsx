import { useCallback } from 'react';

import {
    searchAnimeInfiniteOptions,
    searchCharactersInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
    searchPeopleInfiniteOptions,
} from '@hikka/api';

import LoadMoreButton from '@/components/load-more-button';
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
    { options: OptionsFn; href: string }
> = {
    anime: { options: searchAnimeInfiniteOptions, href: '/anime' },
    manga: {
        options: searchMangaInfiniteOptions as unknown as OptionsFn,
        href: '/manga',
    },
    novel: {
        options: searchNovelInfiniteOptions as unknown as OptionsFn,
        href: '/novel',
    },
    character: {
        options: searchCharactersInfiniteOptions as unknown as OptionsFn,
        href: '/characters',
    },
    person: {
        options: searchPeopleInfiniteOptions as unknown as OptionsFn,
        href: '/people',
    },
};

type Props = {
    contentType: SearchCardType;
    onDismiss: (content: SearchContent) => void;
    type?: 'link' | 'button';
    value?: string;
};

const EntitySearchList = ({ contentType, onDismiss, type, value }: Props) => {
    const router = useRouter();
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
