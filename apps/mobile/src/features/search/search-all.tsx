import type { FC, ReactNode } from 'react';

import { type UseQueryOptions, useQueries } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import { apiErrorMessage } from '@hikka/core';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';

import { type SearchPreview, searchPreviewOptions } from './queries';
import SearchResultRow from './search-result-row';
import SearchRowSkeleton from './search-row-skeleton';
import {
    SEARCH_SCOPES,
    SEARCH_SECTION_TITLES,
    type SearchType,
    searchQuery,
} from './search-scope';
import UserResultRow from './user-result-row';

const ERROR_FALLBACK = 'Перевірте з’єднання та спробуйте ще раз';

const TYPES = SEARCH_SCOPES.filter(
    (scope): scope is SearchType => scope !== 'all',
);

type Props = {
    text: string;
    onShowAll: (type: SearchType) => void;
};

/** The web's "Усе" mode: three results per type, each section opening its own scope. */
const SearchAll: FC<Props> = ({ text, onShowAll }) => {
    const results = useQueries({
        queries: TYPES.map((type) => {
            const query = searchQuery(text, type);

            return {
                ...searchPreviewOptions(type, query ?? ''),
                enabled: query !== null,
            } as UseQueryOptions<unknown, Error, SearchPreview>;
        }),
    });

    const sections: ReactNode[] = [];

    results.forEach((result, index) => {
        const type = TYPES[index];
        const preview = result.data;

        if (!type || !preview?.list.length) return;

        sections.push(
            <View key={type} className="gap-1">
                <Header className="justify-between px-4">
                    <HeaderTitle size="section">
                        {SEARCH_SECTION_TITLES[type]}
                    </HeaderTitle>
                    <Button
                        variant="link"
                        size="sm"
                        onPress={() => onShowAll(type)}
                    >
                        Показати всі
                    </Button>
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
            <EmptyState
                className="mt-8"
                icon={<Icon as={CircleAlert} />}
                title="Не вдалося виконати пошук"
                description={apiErrorMessage(failed.error, ERROR_FALLBACK)}
                action={
                    <Button
                        variant="secondary"
                        onPress={() => failed.refetch()}
                    >
                        Спробувати ще
                    </Button>
                }
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
