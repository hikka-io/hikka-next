import type { FC } from 'react';

import {
    CATALOG_TYPES,
    type CatalogType,
    FiltersPanel,
} from '@/features/filters';

import {
    userListFiltersKey,
    useUpdateUserListFilters,
    useUserListFilters,
} from './user-list-filters-store';

type Props = {
    username: string;
    type?: string;
    onDone: () => void;
};

/** The web's list filter sidebar as a sheet over the open list's filters. */
const UserListFiltersSheet: FC<Props> = ({ username, type, onDone }) => {
    const contentType = (CATALOG_TYPES.find((item) => item === type) ??
        CATALOG_TYPES[0]) as CatalogType;
    const key = userListFiltersKey(username, contentType);

    return (
        <FiltersPanel
            type={contentType}
            mode="userList"
            search={useUserListFilters(key)}
            onUpdate={useUpdateUserListFilters(key)}
            onDone={onDone}
        />
    );
};

export default UserListFiltersSheet;
