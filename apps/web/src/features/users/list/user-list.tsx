import type { FC } from 'react';

import type {
    MainContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/api';

import LoadMoreButton from '@/components/load-more-button';
import type { StackSize } from '@/components/ui/stack';
import { CatalogSummary, useCatalogView } from '@/features/catalog';
import { useRouteSearch } from '@/utils/navigation';
import type { UserlistSearch } from '@/utils/search-schemas';

import GridView from './components/grid-view';
import RecordsNotFound from './components/records-not-found';
import UserListSkeleton from './components/user-list-skeleton';
import TableView from './table-view';
import { useUserList } from './use-user-list';

type Props = {
    content_type: MainContentTypeEnum;
    extendedSize?: StackSize;
};

const UserList: FC<Props> = ({ content_type, extendedSize }) => {
    const search = useRouteSearch<Pick<UserlistSearch, 'status'>>();
    const { view } = useCatalogView('userlist');

    const status = search.status as ReadStatusEnum | WatchStatusEnum | 'all';

    const {
        list,
        pagination,
        isLoading,
        isPending,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        ref,
    } = useUserList(content_type);

    if (!list || !status) {
        return isPending && status ? (
            <div className="flex flex-col gap-6">
                <CatalogSummary isLoading />
                <UserListSkeleton view={view} extendedSize={extendedSize} />
            </div>
        ) : null;
    }

    return (
        <div className="flex flex-col gap-6">
            <CatalogSummary total={pagination?.total} isLoading={isLoading} />
            {list.length > 0 ? (
                view === 'table' ? (
                    <TableView data={list} content_type={content_type} />
                ) : (
                    <GridView
                        data={list}
                        content_type={content_type}
                        extendedSize={extendedSize}
                    />
                )
            ) : (
                <RecordsNotFound status={status} content_type={content_type} />
            )}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default UserList;
