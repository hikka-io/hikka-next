import type { FC } from 'react';

import {
    CATALOG_TYPES,
    type CatalogType,
    FiltersPanel,
} from '@/features/filters';

import {
    useUpdateUserListFilters,
    useUserListFilters,
} from './user-list-filters-store';

type Props = {
    filtersKey: string;
    type?: string;
    onDone: () => void;
};

/** The web's list filter sidebar as a sheet over the open list's filters. */
const UserListFiltersSheet: FC<Props> = ({ filtersKey, type, onDone }) => {
    const contentType = (CATALOG_TYPES.find((item) => item === type) ??
        CATALOG_TYPES[0]) as CatalogType;

    return (
        <FiltersPanel
            type={contentType}
            mode="userList"
            search={useUserListFilters(filtersKey)}
            onUpdate={useUpdateUserListFilters(filtersKey)}
            onDone={onDone}
        />
    );
};

export default UserListFiltersSheet;
