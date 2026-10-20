import { useLocalSearchParams, useRouter } from 'expo-router';

import {
    CATALOG_TYPES,
    type CatalogType,
    FiltersSheet,
} from '@/features/filters';
import { UserListFiltersSheet } from '@/features/users';

/** The catalog's filter sheet, or, with `filters`, the filters of the open user list that key names. */
export default function CatalogFiltersScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ type?: string; filters?: string }>();
    const type = CATALOG_TYPES.find((item) => item === params.type);

    if (params.filters) {
        return (
            <UserListFiltersSheet
                filtersKey={params.filters}
                type={type}
                onDone={() => router.back()}
            />
        );
    }

    return (
        <FiltersSheet
            type={(type ?? CATALOG_TYPES[0]) as CatalogType}
            onDone={() => router.back()}
        />
    );
}
