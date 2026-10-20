import type { FC, ReactNode } from 'react';

import { type UseQueryOptions, useQueries } from '@tanstack/react-query';
import { View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';

import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';

import { type SearchPreview, searchPreviewOptions } from './queries';
import SearchResultRow from './search-result-row';
import SearchRowSkeleton from './search-row-skeleton';
import {
    SEARCH_SECTION_TITLES,
    SEARCH_TYPES,
    type SearchType,
    searchQuery,
} from './search-scope';
import UserResultRow from './user-result-row';

type Props = {
    text: string;
    onShowAll: (type: SearchType) => void;
};

/** The web's "Усе" mode: three results per type, each section opening its own scope. */
const SearchAll: FC<Props> = ({ text, onShowAll }) => {
    const results = useQueries({
        queries: SEARCH_TYPES.map((type) => {
            const query = searchQuery(text, type);

            return {
                ...searchPreviewOptions(type, query ?? ''),
                enabled: query !== null,
            } as UseQueryOptions<unknown, Error, SearchPreview>;
        }),
    });

    const sections: ReactNode[] = [];

    results.forEach((result, index) => {
        const type = SEARCH_TYPES[index];
        const preview = result.data;

        if (!type || !preview?.list.length) return;

        sections.push(
            <View key={type} className="gap-1">
                <Header className="px-4">
                    <HeaderTitle onPress={() => onShowAll(type)}>
                        {SEARCH_SECTION_TITLES[type]}
                    </HeaderTitle>
                </Header>
                {preview.type === ContentTypeEnum.USER
                    ? preview.list.map((user) => (
                          <UserResultRow key={user.reference} user={user} />
                      ))
                    : preview.list.map((item) => (
                          <SearchResultRow key={item.slug} item={item} />
                      ))}
            </View>,
        );
    });

    const pending = results.some((result) => result.isLoading);
    const failed = results.find((result) => result.error);

    if (sections.length > 0) {
        return <View className="gap-6 pb-6">{sections}</View>;
    }

    if (pending) {
        return (
            <View>
                {Array.from({ length: 6 }, (_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                    <SearchRowSkeleton key={index} />
                ))}
            </View>
        );
    }

    if (failed?.error) {
        return (
            <ErrorState
                error={failed.error}
                onRetry={failed.refetch}
                title="Не вдалося виконати пошук"
                className="mt-8"
            />
        );
    }

    return (
        <EmptyState
            className="mt-8"
            title="За Вашим запитом нічого не знайдено"
        />
    );
};

export default SearchAll;
