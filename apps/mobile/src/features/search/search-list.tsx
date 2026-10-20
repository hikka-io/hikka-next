import type { FC, ReactElement } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';

import { ContentTypeEnum, type UserResponse } from '@hikka/api';

import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';

import {
    type ContentSearchType,
    contentSearchOptions,
    type SearchItem,
    userSearchOptions,
} from './queries';
import SearchResultRow from './search-result-row';
import SearchRowSkeleton from './search-row-skeleton';
import type { SearchType } from './search-scope';
import UserResultRow from './user-result-row';

const SKELETON_ROWS: null[] = Array.from({ length: 8 }, () => null);

type Row = SearchItem | UserResponse | null;

type Props = {
    type: SearchType;
    query: string;
    header: ReactElement;
};

type ListProps = {
    header: ReactElement;
    data: Row[];
    error: unknown;
    onRetry: () => void;
    onEndReached?: () => void;
    footer?: ReactElement | null;
};

const ResultList: FC<ListProps> = ({
    header,
    data,
    error,
    onRetry,
    onEndReached,
    footer,
}) => {
    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            data={data}
            keyExtractor={(item, index) =>
                item
                    ? `${'reference' in item ? item.reference : item.slug}:${index}`
                    : `skeleton-${index}`
            }
            renderItem={({ item }) => {
                if (!item) return <SearchRowSkeleton />;
                if ('reference' in item) return <UserResultRow user={item} />;
                return <SearchResultRow item={item} />;
            }}
            ListHeaderComponent={header}
            ListEmptyComponent={
                error ? (
                    <ErrorState
                        error={error}
                        onRetry={onRetry}
                        title="Не вдалося виконати пошук"
                        className="mt-8"
                    />
                ) : (
                    <EmptyState
                        className="mt-8"
                        title="За Вашим запитом нічого не знайдено"
                    />
                )
            }
            ListFooterComponent={footer}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
        />
    );
};

const ContentResults: FC<Props & { type: ContentSearchType }> = ({
    type,
    query,
    header,
}) => {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        refetch,
    } = useInfiniteQuery(contentSearchOptions(type, query));

    return (
        <ResultList
            header={header}
            data={
                isPending
                    ? SKELETON_ROWS
                    : (data?.pages.flatMap((page) => page.list) ?? [])
            }
            error={error}
            onRetry={() => refetch()}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            footer={isFetchingNextPage ? <Spinner className="py-4" /> : null}
        />
    );
};

const UserResults: FC<Props> = ({ query, header }) => {
    const { data, error, isPending, refetch } = useQuery(
        userSearchOptions(query),
    );

    return (
        <ResultList
            header={header}
            data={isPending ? SKELETON_ROWS : (data ?? [])}
            error={error}
            onRetry={() => refetch()}
        />
    );
};

/** One search type: infinite pages for content, the web's single list for users. */
const SearchList: FC<Props> = ({ type, query, header }) => {
    if (type === ContentTypeEnum.USER) {
        return <UserResults type={type} query={query} header={header} />;
    }

    return <ContentResults type={type} query={query} header={header} />;
};

export default SearchList;
